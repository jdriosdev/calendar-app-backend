/*
  Rutas de Usuarios / auth
  host + /api/auth
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renovarToken } = require ('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require ('../middlewares/validar-jwt');


router.post(
  '/new',
  [
    //middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6}),
    validarCampos
  ],
  crearUsuario)

router.post(
  '/',
  [
    //middlewares
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6}),
    validarCampos
  ],
  loginUsuario)

router.get('/renew', validarJWT, renovarToken);

module.exports = router;