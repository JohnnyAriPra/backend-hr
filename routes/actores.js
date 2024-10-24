const { Router } = require('express');
const router = Router();

var { getActores, getActorById, createActor, updateActor, deleteActor } = require('../controllers/actores');

//rutas endpoints para actores
router.get('/actor', getActores);
router.get('/actor/:id', getActorById);
router.post('/actor', createActor);
router.put('/actor/:id', updateActor);
router.delete('/actor/:id', deleteActor);


module.exports = router;