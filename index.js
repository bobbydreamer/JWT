//Requires - Libraries
const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()

//Requires - Modules
const { verifyAccessToken } = require('./helpers/jwt_helper')

//Global Variables
const app = express()
const PORT = process.env.PORT || 3000

//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
const AuthRoute = require('./Routes/Auth.Route');

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send('Hello from express.')
});

// /auth/login
app.use('/auth', AuthRoute)

//Catch-All Route - If a route is not available, this will handle pass to error handler. 
app.use(async (req, res, next) => {
next(createError.NotFound())
});

//Error Handler - Should be the last one
//500 - Internal server not found
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
})
 
//Listening Port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})