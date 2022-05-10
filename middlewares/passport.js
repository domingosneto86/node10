const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: process.env.JWT_AUTH_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true
    }

    const strategy = new Strategy(params, (req, payload, done) => {
        const token = req.header('Authorization').replace('Bearer ', '')
        app.db.select({
                userId: 'usuario.idusuario',
                email: 'usuario.email',
                clientId: 'usuario.idcliente'
            })
            .from(app.constants.db.TABLE.USER)
            .where('usuario.idusuario', payload._id)
            .andWhere('tknacesso', token)
            .first()
            .then(system => {
                if (system) {
                    done(null, { userId: system.userId, clientId: system.clientId, email: system.email })
                } else {
                    done(null, false)
                }
            })
            .catch(err => done(err, false))
    })

    passport.use('auth-login', strategy)

    return {
        initialize: () => passport.initialize(),
        auth: () => passport.authenticate('auth-login', { session: false })
    }
}
