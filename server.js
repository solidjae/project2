const express = require('express');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const mongoURI = 'mongodb://localhost:27017/'
const db = mongoose.connection
const app = express();
const request = require('request')


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//connecting to mongodb
mongoose.connect('mongodb://localhost:27017/project2', () => {
  console.log('The connection with mongod is established')
})
// connecting to localhost 3000
app.listen(3000, ()=>{
    console.log('listening');
});

// setting up schemas and linking them to server

const Schema = require('./models/schema.js')

const weatherSchema = require('./models/weatherSchema.js')

// getting the weather api from openweather



// let geo = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}"

let apiKey = "59e973d4768dbba700b5a0ec7e0d63c1"


// rest


app.get('/', (req, res) => {
  weatherSchema.find({}, (error, searchedWeather) => {
    res.render('index.ejs', {data: searchedWeather})
  })
}) 

app.get('/view', (req, res) => {
  res.render('view.ejs')
})

app.get('/logs', (req, res) => {
  Schema.find({}, (error, allLogs) => {
    res.render('logs.ejs', {data: allLogs})
  })
})

app.get('/new', (req, res) => {
  res.render('new.ejs')
})

// making a schema based on the new log

app.post('/logs', (req, res) => {
  Schema.create(req.body, (error, createdLog) => {
    console.log('log created')
    console.log(req.body)
    res.redirect('/logs')
  })
})

// receiving the post from searching the weather city



app.post('/', (req, res) => {
  weatherSchema.deleteMany({}, (err, result) => {
    console.log('emptied collection')
  })

  let city = String(req.body.city)

  // No longer needed

  // let cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
  // let container = []
  // request(cityUrl, (error, response, body) => {
  //   city_json = JSON.parse(body);
  //   console.log(city_json[0].name)
  //   console.log(city_json[0].lat)
  //   console.log(city_json[0].lon)
  //   container.push(city_json[0].lat)
  //   container.push(city_json[0].lon)
  //   console.log(container)
  // })
  // let lat = container[0]
  // let lon = container[1]

  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  request(weatherUrl, (error, response, body) => {
    weather_json = JSON.parse(body);
    console.log(weather_json)

    let weather = {
      city: city,
      temperature: String(Math.round(weather_json.main.temp)), 
      description: String(weather_json.weather[0].description),
      icon: String(weather_json.weather[0].icon),
    }
    console.log(weather.temperature)
    weatherSchema.create(weather, (error, weather) => {
      console.log('schema created for weather')
    })
    res.redirect('/')
  })
})

app.get('/logs/:id', (req, res) => {
  Schema.findById(req.params.id, (error, log) => {
    res.render('show.ejs', {data: log})
  })
})

app.get('/logs/edit/:id', (req, res) => {
  Schema.findById(req.params.id, (error, log) => {
    res.render('edit.ejs', {data: log})
  })
})

// getting the edit data and putting it in 

app.put('/logs/:id', (req, res) => {
  Schema.findOneAndUpdate(req.params.id, req.body, { new: true }, (error, task) => {
    res.redirect('/logs')
  })
})

app.delete('/logs/delete/:id', (req, res) => {
  console.log('delete')
  Schema.findByIdAndRemove(req.params.id, { new: true}, (error, task) => {
  })
  res.redirect('/logs')
})