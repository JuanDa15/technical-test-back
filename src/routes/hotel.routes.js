/**
 * hotel: /api/hotels
 */
const { Router } = require('express');
const { createHotel, getHotels, updateHotel, deleteHotel, getHotel, getHotelsPrivate } = require('../controllers/hotel.controller');
const validateJWT = require('../middlewares/validate-token.middleware');
const { check } = require('express-validator');
const validateFields = require('../middlewares/validate-fields.middleware');


const router = Router();

router.get('/', getHotels)
router.get('/priv', validateJWT,getHotelsPrivate)
router.post('/', [
  validateJWT,
  check('name', 'name is required').notEmpty(),
  check('location', 'location is required').notEmpty(),
  check('address', 'address is required').notEmpty(),
  check('email','Email is required').notEmpty(),
  check('email','Email is not valid').isEmail(),
  validateFields
], createHotel)
router.patch('/:id', validateJWT, updateHotel)
router.delete('/:id', validateJWT, deleteHotel)
router.get('/:id', getHotel)

module.exports = router;