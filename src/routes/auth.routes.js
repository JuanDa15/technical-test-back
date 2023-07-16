/**
 * 
 */
const { Router, response } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controller');
const validateFields = require('../middlewares/validate-fields.middleware');

const router = Router();

router.post('/', [
  check('email', 'Email is required').notEmpty(),
  check('email', 'Email should be a valid email').isEmail(),
  check('password', 'Password is required').notEmpty(),
  validateFields
], login)

module.exports = router;