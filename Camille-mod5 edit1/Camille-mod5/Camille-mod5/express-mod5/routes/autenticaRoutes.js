const express = require('express')
const router = express.Router()
const autenticaController = require('../controllers/autenticaController')

router.get('/login', autenticaController.login)
router.post('/login', autenticaController.loginPost)
router.get('/register', autenticaController.register)
router.post('/register', autenticaController.registerPost)
router.get('/logout', autenticaController.logout)

module.exports = router