const Router = require('express')
const router = new Router()
const decodeRouter = require('./decodeRouter')
const cardRouter = require('./cardRouter')
const userRouter = require('./userRouter')


router.use('/decode', decodeRouter)
router.use('/card', cardRouter)
router.use('/user', userRouter)

module.exports = router