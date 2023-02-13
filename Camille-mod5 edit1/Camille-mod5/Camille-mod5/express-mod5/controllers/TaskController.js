const session = require('express-session')
const Task = require('../models/Task')
const usuario = require('../models/Usuario')
const { Op } = require('sequelize')
const { use } = require('../routes/taskRoutes')


module.exports = class TaskController {

    static async showTask(req, res) {

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const taskData = await Task
        .findAll({
            include: usuario,
            where: {
                title: { [Op.like]: `%${search}%` },
            },
            order: [['createdAt', order]]
        })

        const tasks = taskData.map((result) => result.get({ plain: true }))

        let taskQty = tasks.length

        if (taskQty === 0) {
            taskQty = false
        }
        console.log('Resultados: ')
        console.log(tasks, taskQty)
        res.render('task/home', { tasks, search, taskQty })
    }//fim função show

    static async dashboard(req, res) {
        const userId = req.session.Usuarioid;
        console.log("userId", userId)

        const user = await usuario.findOne({
            where: {
                id: userId,
            },
            plain: true,
        })

        console.log("Usuário", user)
        //Checagem
        if (!user) {
            res.redirect('/login')
        }
        const task = await Task.findOne({
            where: {
                UsuarioId: userId,
            },
            plain: true,
        })
        console.log("Task", task)
        let emptytask = false

        if (!task) {
            emptytask = true
        }

        res.render('task/dashboard', {task})
    }

    static addtarefa(req, res) {
        res.render('task/create')
    }

    static async createtarefaSalva(req, res) {
        const task = {
            title: req.body.title,
            UsuarioId: "1"
        }

        console.log("Task", task)

        try {
            await Task.create(task)

            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/task/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async updateTask(req, res) {
        const id = req.params.id
        const task = await Task.findOne({ where: { id: id }, raw: true })

        res.render('task/edit', { task })
    }

    static async salvaratualicacaotask(req, res) {
        const id = req.body.id

        const task = {
            title: req.body.title
        }

        try {
            await Task.update(task, { where: { id: id } })

            req.flash('message', 'Pensamento atualizado com sucesso')

            req.session.save(() => {
                res.redirect('/task/dashboard')
            })

        } catch (error) {
            console.log(error)
        }
    }

    static async removetarefa(req, res) {
        const id = req.body.id;
        const usuarioid = req.session.Usuarioid;

        try {
            await Task.destroy({ where: { id: id, Usuarioid: usuarioid } })

            req.flash('message', 'Tarefa removido com sucesso!')

            req.session.save(() => {
                res.redirect('/login')
            })
        } catch (error) {
            console.log(error)
        }
    }
}