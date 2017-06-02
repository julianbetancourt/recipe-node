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

app.get('/add-recipe', async (req, res) => {
  res.render('add-recipe')
})

app.post('/add-recipe', async (req, res) => {
  const recipe = Object.assign({}, req.body, {
    ingredients: req.body.ingredients.split(',')
  })

  await (new Recipe(recipe)).save()
  res.redirect('/')
})

app.post('/delete-recipe/:id', async (req, res) => {
  // TODO: if !id => "doesn't exist"
  const id = req.params.id
  await Recipe.findByIdAndRemove(id).exec()
  res.redirect('/')
})



module.exports = app
