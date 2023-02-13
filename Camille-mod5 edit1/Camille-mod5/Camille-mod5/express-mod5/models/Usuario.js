const { DataTypes } = require('sequelize')

const db = require('../db/conn')

//Usuario
const Usuario = db.define('Usuario', {
    
    name: {
        type: DataTypes.STRING,
        require: true,
    },
    email: {
        type: DataTypes.STRING,
        require: true,
    },
    password: {
        type: DataTypes.STRING,
        require: true,
    },
})

module.exports = Usuario