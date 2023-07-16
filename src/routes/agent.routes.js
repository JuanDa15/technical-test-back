/**
 * Route: '/api/agents'
 */
const { Router } = require('express');
const { getAgents, createAgent, updateAgent, deleteAgent } = require('../controllers/agent.controller');
const { check } = require('express-validator');
const validateFields = require('../middlewares/validate-fields.middleware');
const validateJWT = require('../middlewares/validate-token.middleware');

const router = Router();

router.get('/', validateJWT, getAgents)
router.post('/', [
  validateJWT,
  check('name', 'name is required').not().isEmpty(),
  check('lastName', 'lastName is required').not().isEmpty(),
  check('email', 'should be a valid email').isEmail(),
  check('password', 'password is required').not().isEmpty(),
  validateFields
] ,createAgent)
router.patch('/:id', [validateJWT], updateAgent)
router.delete('/:id', [validateJWT],deleteAgent)
module.exports = router;