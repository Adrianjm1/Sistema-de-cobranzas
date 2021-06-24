const jwt = require('jsonwebtoken');

let validToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario; //Es como si se abriese una sesión nueva, a ese atributo req.usuario se le pasarán todos los datos del decode.usuario
        next();

    });

}



let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.id === 1) {

        next();
    } else {

        return res.send({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        })

    }

}


module.exports = {
    validToken
}