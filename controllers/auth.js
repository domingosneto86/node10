const { validationResult  } = require('express-validator');

module.exports = app => {
   /**
     * Rotirna de login
    */
   app.post("/auth/signin", app.models.auth.validate('login'),
   async (req, res) => {
     try {
       console.log('body :', req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: {msg: errors.array()[0].msg} });
        }

        const result = await app.models.auth.signin(req.body)
        if (!app.utils.error.check400(result, res)) {
            res.status(200).send(result) 
        }
     } catch (err) {
        console.log('erro /auth/signin', err);
        app.utils.error.check400(err, res);
     } 
   })
   
  }
  