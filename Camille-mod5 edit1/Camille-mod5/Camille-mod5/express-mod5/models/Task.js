const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Usuario = require('./usuario')

const Task = db.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

Task.belongsTo(Usuario)
Usuario.hasMany(Task)

module.exports = Task