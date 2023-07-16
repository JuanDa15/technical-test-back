const { verify } = require("jsonwebtoken")

const validateJWT = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({
      ok: false,
      data: 'Auth token not provided'
    })
  }

  try {
    const { uid } = verify(token, process.env.JWT_SECRET);
    req.uid = uid;

  } catch (error) { 
    return res.status(401).json({
      ok: false,
      data: 'Invalid token'
    })
  }

  next()
}


module.exports = validateJWT