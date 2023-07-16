const { Router } = require('express');
const { createHotel, getHotels, updateHotel, deleteHotel } = require('../controllers/hotel.controller');
const validateJWT = require('../middlewares/validate-token.middleware');
const { check } = require('express-validator');
const validateFields = require('../middlewares/validate-fields.middleware');


const router = Router();

router.get('/', validateJWT, getHotels)
router.post('/', [
  validateJWT,
  check('name', 'name is required').notEmpty(),
  check('location', 'location is required').notEmpty(),
  check('address', 'address is required').notEmpty(),
  check('email','Email is required').notEmpty(),
  check('email','Email is not valid').isEmail(),
  // TODO: PONER VALIDADOR DE LONGITUD DE ROOMS,
  validateFields
], createHotel)
router.patch('/:id', validateJWT, updateHotel)
router.delete('/:id', validateJWT, deleteHotel)


module.exports = router;