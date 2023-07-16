const { sign } = require('jsonwebtoken')

const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid }
    sign(payload, process.env.JWT_SECRET, {
      // TODO: CAMBIAR DURACIÓN
      expiresIn: '10m'
    }, (err, token) => {
      if (err) {
        console.log(err)
        reject('Error generating JWT')
      } else {
        resolve(token)
      }
    })
  })
}

module.exports = {
  generateJWT
}