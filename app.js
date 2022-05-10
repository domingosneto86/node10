const express = require('express')
const app = express()
const db = require('./config/db')
const consign = require('consign')
const moment = require('moment')

consign()
    .include('./middlewares/passport.js')
    .then('./middlewares/upload.js')
    .then('./middlewares/express.js')
    .then('./constants')
    .then('./utils')
    .then('./models')
    .then('./controllers')
    .into(app)


app.db = db

moment.updateLocale('pt-BR', null)
app.moment = moment

module.exports = app;
