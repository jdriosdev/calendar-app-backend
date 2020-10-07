/*
  Event Routes
  /api/events
*/



const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt')
const { 
  getEventos, 
  crearEvento,
  actualizarEventos,
  eliminarEventos
} = require("../controllers/events");
const {isDate} = require ('../helpers/isDate');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//debajo de esta linea se validan todas las rutas
//todas deben estar validadas
router.use(validarJWT);


//obtener eventos
router.get('/', getEventos)

//obtener eventos
router.post(
  '/', 
  [
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom(isDate),
    check('end','Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
  ],
  crearEvento )

//obtener eventos
router.put('/:id', actualizarEventos)

//obtener eventos
router.delete('/:id', eliminarEventos)


module.exports = router;
