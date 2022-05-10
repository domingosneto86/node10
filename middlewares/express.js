const cors = require('cors')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

module.exports = app => {
    app.use(cors({
        origin: '*'
    }))
    // app.use(cors())
    app.use(bodyParser.json())
    app.use(urlencodedParser)
    app.use(app.middlewares.passport.initialize())
}