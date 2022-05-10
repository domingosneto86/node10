const jwt = require('jsonwebtoken')
const { check } = require('express-validator');

module.exports = app => {
    
  const validate = (method) => {
    switch (method) {
      case 'login': 
          return [
              check('login').exists().withMessage(() => {
                  return app.constants.message.USER_PASSWORD_REQUIRED
              }),
              check('password').exists().withMessage(() => {
                return app.constants.message.USER_PASSWORD_REQUIRED
              })                          
          ]    
    }       
  }    

  const signin = async({login, password}) => {
    try{
      const lowerLogin = login.toLowerCase()      
      
      const user = await app.db
          .select({
              userId: 'usuario.idusuario',
              userName: 'usuario.nome',
              password: 'usuario.senha',
              clientName: 'cliente.nome',
              clientId: 'cliente.idcliente',
              statusId: 'usuario.idstatus',
              log: 'cliente.longitude',
              lat: 'cliente.latitude'
          })
          .from(app.constants.db.TABLE.USER)
          .innerJoin(app.constants.db.TABLE.CLIENT,
              'usuario.idcliente', 'cliente.idcliente')
          .where('usuario.login', lowerLogin)
          .first()

      if (user) {
          if (user.statusId !== app.constants.base.STATUS.ACTIVE) {              
              return app.utils.error.format({message: app.constants.message.USER_INATIVE})
          }
          
          const isMatch = await app.utils.crypt.crypt(password) === user.password

          if (isMatch) {                    
              const token = jwt.sign({ _id: user.userId.toString() }, process.env.JWT_AUTH_SECRET)
              
              await app.db(app.constants.db.TABLE.USER).update({ 
                tknacesso: token,
              })
              .where('idusuario', user.userId)
              
              return {
                  login: lowerLogin,
                  userName: user.userName,
                  clientId: user.clientId,
                  tknaccess: token,
                  clientName: user.clientName,
                  lat: user.lat,
                  log: user.log                  
              }
          } else {
            return {
                errors: {msg: app.constants.message.AUTH_INVALID}
            }         
          }
      } else {          
          return {
              errors: {msg: app.constants.message.AUTH_INVALID}
          }
      }
    } catch (err) {
      console.log(err)
      return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'auth.signin');
    }
  }
   
  return {
      validate,
      signin
   }
}
