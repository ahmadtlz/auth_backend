const sharp = require('sharp')
const becrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

exports.generateTokens = id => {
  const accessToken = jwt.sign({id}, process.env.JWT_KEY, {
    expiresIn: '5d',
  })
  const refreshToken = jwt.sign({id}, process.env.JWT_KEY, {
    expiresIn: '30d',
  })

  return {accessToken, refreshToken}
}
exports.reGenerateTokens = refreshToken => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_KEY)
  const accessToken = jwt.sign({id: decoded.id}, process.env.JWT_KEY, {
    expiresIn: '5d',
  })

  return {accessToken}
}

exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        reject(new Error(err.message))
      } else {
        resolve(decoded)
      }
    })
  })
}

exports.hashPassword = async password => {
  const salt = await becrypt.genSalt(10)
  const hash = await becrypt.hash(password, salt)
  return hash
}

exports.isPassMatched = async (password, hash) => {
  return await becrypt.compare(password, hash)
}
