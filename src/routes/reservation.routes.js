const { Router } = require('express');
const { getReservations, createReservation } = require('../controllers/reservation.controller');
const { check } = require('express-validator');
const router = Router();

router.get('/', getReservations)
router.post('/', [
  check('hotel', 'hotel is required').isMongoId(),
  check('room', 'room is required').isMongoId(),
  check('startDate', 'startDate is required').notEmpty(),
  check('endDate', 'endDate is required').notEmpty(),
  check('startDate', 'startDate is required').isDate(),
  check('endDate', 'endDate is required').isDate(),
],createReservation)

module.exports = router;