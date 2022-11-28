const mongoose = require('mongoose')

const weatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    description: String,
    icon: String
})

const weather = mongoose.model('weather', weatherSchema)

module.exports = weather
