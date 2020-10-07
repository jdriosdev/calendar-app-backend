const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos =  async(req, res = response) => {

  try {
    const eventos = await Evento.find().populate('user','name')

  res.json({
    ok:true,
    eventos
  })
  } catch (error) {
    console.log(error)
  }
}

const crearEvento =  async (req, res = response) => {

  const evento = new Evento(req.body)

  try {
    
    evento.user = req.uid;

    const eventoGuardado = await evento.save()

    res.json({
      ok: true,
      evento: eventoGuardado
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const actualizarEventos = async (req, res = response) => {

  const eventoId = req.params.id;
  const uid = req.uid;
  
  try {

    const evento = await Evento.findById( eventoId ); 

    if ( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'Ese evento no existe'
      })
    }

    if ( evento.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'no tiene privilegios de modificar este envento'
      })
    }

    const nuevoEvento = {
      ...req.body,
      user: uid
    } 

    const eventoActualziado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true} );

    res.jsonp({
      ok: true,
      evento: eventoActualziado
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }

}

const eliminarEventos = async(req, res = response) => {


  const eventoId = req.params.id;
  const uid = req.uid;
  
  try {

    const evento = await Evento.findById( eventoId ); 

    if ( !evento ) {
      return res.status(404).json({
        ok: false,
        msg: 'Ese evento no existe'
      })
    }

    if ( evento.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'no tiene privilegios de eliminar este evento'
      })
    }

    await Evento.findByIdAndDelete( eventoId);

    res.jsonp({
      ok: true,
      msg: 'Evento eliminado'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }

}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEventos,
  eliminarEventos

}