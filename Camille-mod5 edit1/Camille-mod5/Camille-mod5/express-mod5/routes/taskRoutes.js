const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/TaskController')
//helpers
const checkAuth = require('../helpers/autenticar').checkAuth

router.get('/add', checkAuth, TaskController.addtarefa)
router.post('/add', checkAuth, TaskController.createtarefaSalva)
router.get('/edit/:id', checkAuth, TaskController.updateTask)
router.post('/edit', checkAuth, TaskController.salvaratualicacaotask)
router.get('/dashboard', checkAuth, TaskController.dashboard)
router.post('/remove', checkAuth, TaskController.removetarefa)
router.get('/', TaskController.showTask)


module.exports = router