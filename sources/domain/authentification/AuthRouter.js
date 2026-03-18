const Router = require('express')
const router = new Router()
const controller = require('./AuthController')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/check', controller.check)
router.post('/logout', controller.logout)
router.post('/updateUserData', controller.updateUserData)

module.exports = router