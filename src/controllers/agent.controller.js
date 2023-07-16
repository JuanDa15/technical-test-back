const Agent = require('../models/agent.model');
const { response } = require('express');
const { genSaltSync, hashSync } = require('bcryptjs')



const getAgents = async (req, res) => {
  const { from = 0 } = req.query;
  
  try {
    const [agents, count] = await Promise.all([
      Agent.find({}, { password: 0 })
                    .where('deleted').equals(false)
                    .skip(Number(from))
                    .limit(7),
      Agent.count()
    ])

    return res.status(200).json({
      ok: true,
      data: {
        data: agents,
        count: count
      }
    })
  } catch (error) {

  }
}

const createAgent = async (req, res = response) => {

  const {email, ...others} = req.body;

  try {
    const emailExist = await Agent.findOne({email});
    
    if (emailExist) {
      return res.status(400).json({
        ok: false,
        data: 'Email already exist'
      })
    }

    const agent = new Agent({email, ...others});

    const salt = genSaltSync();
    agent.password = hashSync( others.password, salt)

    await agent.save();
  
    res.status(200).json({
      ok: true,
      data: 'successfully created'
    })


  } catch (error) {
      res.status(500).json({
          ok: false,
          data: 'Unexpected error. Contact the administrator'
      });
    }
}


const updateAgent = async (req, res = response) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const usuarioDB = await Agent.findById(id);
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        data: 'User not found'
      })
    }

    if (body.email) {
      const findAgent = await Agent.findOne({email: body.email});

      if (findAgent) {
        return res.status(400).json({
          ok: false,
          data: 'Email already exist'
        })
      }

      if (usuarioDB.email === body.email) {
        delete body.email;
      }
    }

    const updatedUser = await Agent.findByIdAndUpdate(id, body, { new: true});

    return res.status(200).json({
      ok: true,
      data: updatedUser
    })


  } catch (error) {
    res.status(500).json({
        ok: false,
        data: 'Unexpected error. Contact the administrator'
    });
  }
}

const deleteAgent = async (req, res = response) => {
  const { id } = req.params;
  try {
    const agentDB = await Agent.findById(id);
    if (!agentDB) {
      return res.status(400).json({
        ok: false,
        data: 'User not found'
      })
    }

    if (agentDB.deleted) {
      return res.status(400).json({
        ok: false,
        data: 'User dont exits'
      })
    }

    const updatedAgent = await Agent.findByIdAndUpdate(id, {
      deleted: true
    }, { new: true });

    return res.status(200).json({
      ok: true,
      data: 'Deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
        ok: false,
        data: 'Unexpected error. Contact the administrator'
    });
  }
}


module.exports = {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent
}