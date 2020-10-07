const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

  const { name, email, password } = req.body; 

  try {

    let usuario = await  Usuario.findOne({ email })
    if (usuario) {
      return res.status(400).json({
        ok:false,
        msg: 'Este correo ya esta registrado'
      })
    }

    usuario = new Usuario( req.body );

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );


    await usuario.save()
    //Generar token
    const token  = await generarJWT( usuario.id, usuario.name)


  res.status(201).json({
    ok:true,
    uid: usuario.id,
    name: usuario.name,
    token
  })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg:'Por favor hable con el admin'
    })
  }

  
}

const loginUsuario = async (req, res = response) => {
  const {  email, password } = req.body; 
  try {
    let usuario = await  Usuario.findOne({ email })
    if (!usuario) {
      return res.status(400).json({
        ok:false,
        msg: 'Este email no esta registrado'
      })
    }
    //confirmar los passwords
    const validPassword = bcrypt.compareSync( password, usuario.password )   
    if ( !validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }
    //Generar JWT
    const token  = await generarJWT( usuario.id, usuario.name)
    
    res.json({
      ok:true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg:'Por favor hable con el admin'
    })
  }
}

const renovarToken = async (req, res = response) => {

  try {
     // const uid = req.uid;
  // const name = req.name;
  const {uid, name} = req;


  //generar un nuevo token JWT y retornarlo en esta peticion

  const token = await generarJWT( uid, name)

  res.json({
    ok:true,
    token
  }) 
  } catch (error) {
    console.log(error)
  }
} 

module.exports = {
  crearUsuario,
  loginUsuario,
  renovarToken

}