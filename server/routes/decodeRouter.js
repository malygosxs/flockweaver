const Router = require('express')
const decodeController = require('../controllers/decodeController')
const router = new Router()


router.get('/deck', decodeController.decodeDeckstring)
router.get('/validate', decodeController.validateDecks)
router.post('/newuuid', decodeController.createNewUrl)

module.exports = router