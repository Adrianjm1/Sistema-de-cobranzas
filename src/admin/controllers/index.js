const md5 = require('md5')
const Admin = require('../domain');
const jwt = require('jsonwebtoken');
const { Id, Schema, Username } = require('../validations');

async function getAll(req, res){
  try {
    const data = await Admin.all();
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function getOne(req, res){
  try {
    const { id } = await Id.validateAsync(req.params);
    const data = await Admin.single({
      where: {id: id}
    });
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function make(req, res){
  try {
    const body = await Schema.validateAsync(req.body);
    const data = await Admin.create(body);
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function signUp(req, res){
  try {
    const body = await Schema.validateAsync(req.body);
    body.password = md5(body.password);

    const data = await Admin.create(body);
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function login(req, res){

  try {
    const { username, password } = await Username.validateAsync(req.body);

    const passwordHash = md5(password);
    console.log(password);
    const data = await Admin.single({
      where: {username}
    });
    
    if(!data){
      return res.send({
        ok: false,
        resp: 'Usuario o contraseña incorrectos'    //Se colocan los parentesis de muestra, pero se deben quitar
      })
    }

    if(passwordHash !== data.password){
      return res.send({
        ok: false,
        resp: 'Usuario o contraseña incorrectos'      //Se colocan los parentesis de muestra, pero se deben quitar
      })
    }

    data.password = null;

    let token = jwt.sign({
      usuario: data
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    res.send({
      ok: true,
      usuario: data,
      token
    });

  } catch (e) {
    res.status(400).send({error: e.message})
  }



}

module.exports = {
  getAll,
  getOne,
  signUp,
  login
}
