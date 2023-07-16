const { Router } = require('express');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/room.controller');
const validateJWT = require('../middlewares/validate-token.middleware');
const { check } = require('express-validator');
const validateFields = require('../middlewares/validate-fields.middleware');

const router = Router();


router.get('/', [
  validateJWT
], getRooms)
router.post('/', [
  validateJWT,
  check('location', 'location is required').notEmpty(),
  check('baseCost', 'baseCost is required').notEmpty(),
  check('taxes', 'taxes is required').notEmpty(),
  check('type', 'type is required').notEmpty(),
  check('hotel', 'hotel is required').isMongoId(),
  validateFields
],createRoom)
router.patch('/:id', [
  validateJWT
], updateRoom)
router.delete('/:id', [
  validateJWT
], deleteRoom)

module.exports = router;