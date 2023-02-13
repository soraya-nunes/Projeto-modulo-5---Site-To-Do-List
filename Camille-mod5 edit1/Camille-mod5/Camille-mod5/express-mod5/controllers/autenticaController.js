const usuario = require('../models/usuario')

const bcrypt = require('bcryptjs')

module.exports = class autenticaController {
    static login(req, res){
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        //Encontrar usuario
        const Usuario = await usuario.findOne({ where: { email: email } })

        if (!Usuario) {
            req.flash('message', 'usuário não encontrado')
            res.render('auth/login')

            return
        }

        //Verificação de senha
        const passwordverificar = bcrypt.compareSync(password, Usuario.password)

        if (!passwordverificar) {
            req.flash('message', 'senha invalida, por favor, tente novamente!')
            res.render('auth/login')

            return
        }

        //initialize session
        req.session.Usuarioid = Usuario.id

        req.flash('message', "autenticação realizada com sucesso!")
        req.session.save(() => {
            res.redirect('task/dashboard')
        })
    }
    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        console.log('ESTA AQUI')
        console.log(name, email, password, confirmpassword)
        

        //password validation
        if (password != confirmpassword) {
            req.flash('message', 'As Senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        //check user exists
        const checkIfUserExists = await usuario.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', 'Usuario já cadastrado!')
            res.render('auth/register')

            return
        }

        //create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await usuario.create(user)

            // initialize session
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro Realizado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }


    

}