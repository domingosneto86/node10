require('dotenv').config();
const app = require('./app.js');

var serverApp = app.listen(process.env.PORT || 8081, '0.0.0.0',() => {
    console.log('Torno-api executando na porta:', process.env.PORT || 8081)
});

app.server = serverApp;

module.exports = app;