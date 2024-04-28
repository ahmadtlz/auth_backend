const {verifyToken} = require('../utils')
const jwt = require('jsonwebtoken')

exports.isAuthenticated = model => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      const decoded = await verifyToken(token)

      const isExpired = Date.now() >= decoded.exp * 1000
      if (isExpired) {
        return res.status(401).json({message: 'Token has expired'})
      }

      const userId = decoded.id

      const user = await model.findById(userId).select('fullname email role')
      if (!user) {
        throw new Error('User not found')
      }

      req.userAuth = user
      next()
    } catch (error) {
      res.status(401).json({message: error.message})
    }
  }
}

exports.roleRestriction = (...roles) => {
  // console.log(roles)
  return (req, res, next) => {
    if (!roles.includes(req.userAuth.role)) {
      throw new Error('You do not have permission to perform this action')
    }
    next()
  }
}

exports.globalErrHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const status = err.status || 'failed'
  const message = err.message || 'Internal Server Error'
  const stack = err.stack

  res.status(statusCode).json({
    status,
    message,
    stack,
  })
}

exports.notFoundErr = (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on the server`)
  error.status = 'failed'
  error.statusCode = 404
  next(error)
}
