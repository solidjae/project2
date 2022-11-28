const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    city: String,
    description: String,
    temperature: Number,
    date: String
})

const Schema = mongoose.model('logs', logSchema)

module.exports = Schema
