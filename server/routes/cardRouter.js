const Router = require('express')
const cardController = require('../controllers/cardController')
const checkRole = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', /*checkRole('ADMIN'),*/ cardController.create)
router.post('/bulk', /*checkRole('ADMIN'),*/ cardController.createBulk)
router.get('/:lng/:id', cardController.getOne)
router.get('/', cardController.getAll)


module.exports = router