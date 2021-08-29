const createError = require('http-errors')

const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
  } = require('../helpers/jwt_helper')

let  refreshToken = async (req, res, next)=>{

    try {
        const { refreshToken } = req.body

        if (!refreshToken) throw createError.BadRequest()
        
        const userId = await verifyRefreshToken(refreshToken) 
        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        console.log({accessToken, refToken})
        
        res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    refreshToken
}