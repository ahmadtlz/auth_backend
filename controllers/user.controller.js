const AsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {
  hashPassword,
  isPassMatched,
  generateTokens,
  reGenerateTokens,
} = require('../utils')

exports.signup = AsyncHandler(async (req, res) => {
  const {fullname, email, password, role} = req.body

  const userFound = await User.findOne({email})
  if (userFound) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hashPassword(password)
  const userCreated = await User.create({
    fullname,
    email,
    password: hashedPassword,
    role,
  })
  // console.log(userCreated)
  const {accessToken, refreshToken} = generateTokens(userCreated._id)

  res.status(201).json({
    status: 'success',
    message: 'user registered successfully',
    user: {fullName: userCreated.fullName, email: userCreated.email},
    accessToken,
    refreshToken,
  })
})

exports.signin = AsyncHandler(async (req, res) => {
  const {email, password} = req.body

  const user = await User.findOne({email})
  // console.log(user)
  if (!user) {
    return res.json({message: 'Invalid login crendentials'})
  }

  const isMatched = await isPassMatched(password, user?.password)
  if (!isMatched) {
    return res.json({message: 'Invalid login crendentials'})
  }
  const {accessToken, refreshToken} = generateTokens(user?._id)

  res.status(200).json({
    status: 'success',
    message: 'user logged in successfully',
    data: {
      user: {fullName: user.fullname, email: user.email, role: user.role},
      accessToken,
      refreshToken,
    },
  })
})

exports.refreshToken = AsyncHandler(async (req, res) => {
  const {refreshTokenStorage} = req.body

  if (!refreshTokenStorage) {
    return res.status(401).json({message: 'Refresh token is required'})
  }

  const {accessToken} = reGenerateTokens(refreshTokenStorage)

  res.status(200).json({
    status: 'success',
    message: 'create new token ',
    data: {accessToken},
  })
})
