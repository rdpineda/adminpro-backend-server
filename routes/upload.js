var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de colecciones validas

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No es una coleccion valida',
            errors: { message: 'No es una coleccion valida' }
        });

    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se selecciono ningun archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //extensiones validas

    var extensionesValidas = ['png', 'jpg', 'jpeg', 'git'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son:' + extensionesValidas.join(', ') }
        });
    }

    //nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //mover el archivo del temporal a un path especifica

    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);



    })






});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el usuario',
                    errors: { message: 'No existe el usuario' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {

                });
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        })


    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el medico',
                    errors: { message: 'No existe el medico' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            //si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {

                });
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del medico actualizada',
                    medico: medicoActualizado
                });
            });
        })



    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el hospital',
                    errors: { message: 'No existe el hospital' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {

                });
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        })



    }

}

module.exports = app;