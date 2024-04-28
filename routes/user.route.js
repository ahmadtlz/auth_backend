const express = require('express')
const User = require('../models/User')
const userController = require('../controllers/user.controller')
const {isAuthenticated, roleRestriction} = require('../middlewares')

const userRouter = express.Router()

userRouter.post('/auth/signup', userController.signup)
userRouter.post('/auth/signin', userController.signin)
userRouter.post('/auth/refresh-token', userController.refreshToken)

module.exports = userRouter
