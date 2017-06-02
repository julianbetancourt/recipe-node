const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const helpers = require('./helpers')

// set pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Expose helpers
app.use((req, res, next) => {
  res.locals.h = helpers
  next()
})

// recipe scheema
const recipeSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  serves: {
    required: true,
    type: Number,
  },
  ingredients: {
    required: true,
    type: Array,
  },
  instructions: {
    required: true,
    type: String
  }
})

// Recipe model
const Recipe = mongoose.model('recipe', recipeSchema)

// Routes
app.get('/', async (req, res) => {
  const recipes = await Recipe.find()
  res.render('index', {
    recipes,
  })

})

app.post('/add-recipe', (req, res) => {
  const { name, serves, ingredients, instructions } = req.body
  const newRecipe = {
    name,
    serves,
    ingredients,
    instructions,
  }

  new Recipe(newRecipe).save()
    .then(recipe => {
      console.log('new recipe created: ' + recipe)
    })


})

app.get('/recipes', (req, res) => {
  Recipe.find()
    .then(recipes => res.send(recipes))
})


module.exports = app
