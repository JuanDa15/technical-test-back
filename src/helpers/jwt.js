const { sign } = require('jsonwebtoken')

const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid }
    sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    }, (err, token) => {
      if (err) {
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