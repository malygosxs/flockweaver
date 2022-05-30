const Router = require('express')
const decodeController = require('../controllers/decodeController')
const router = new Router()


router.get('/deck', decodeController.decodeDeckstring)
router.get('/validate', decodeController.validateDecks)
router.post('/newuuid', decodeController.createNewUrl)
router.get('/decks', decodeController.decodeDecks)
router.get('/currentdecks', decodeController.getCurrentDecks)

module.exports = router