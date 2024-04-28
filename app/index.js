const express = require('express')
const cors = require('cors')
const {globalErrHandler, notFoundErr} = require('../middlewares')
const userRouter = require('../routes/user.route')

const app = express()

//Middlewares
app.use(express.json({limit: '5mb'}))

// remove the localhost and add your frontend root
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)
app.options('*', cors())

app.use(express.static('public'))

//Routes
app.use('/api/v1', userRouter)

//Error middlewares
app.use(notFoundErr)
app.use(globalErrHandler)

module.exports = app
