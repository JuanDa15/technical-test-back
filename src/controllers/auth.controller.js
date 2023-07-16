const { response } = require('express');
const { compareSync } = require('bcryptjs')
const Agent = require('../models/agent.model');
const { generateJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const agentDB = await Agent.findOne().where('email').equals(email)

    if (!agentDB) {
      return res.status(400).json({
        ok: false,
        data: 'Invalid credentials'
      })
    }

    const validPassword = compareSync(password, agentDB.password)

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        data: 'Invalid credentials'
      })
    }


    const token = await generateJWT(agentDB.id)

    return res.status(200).json({
      ok: true,
      data: agentDB,
      token: token
    })
    
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: 'Unexpected error. Contact the administrator'
    })
  }
}


module.exports = {
  login
}