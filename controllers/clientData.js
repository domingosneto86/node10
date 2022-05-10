const { validationResult  } = require('express-validator');

module.exports = app => {
  /**
   * Rotina que retorna os dados de localicação da ultima versão do cliente mais atual
  */
  app.post("/data/version", app.middlewares.passport.auth('auth-login'),
    async (req, res) => {
      try {
          const result = await app.models.clientData.getVersion(req.user)
          if (!app.utils.error.check400(result, res)) {
              res.status(200).send(result) 
          }
      } catch (err) { 
          app.utils.error.check400(err, res)
      } 
    });    

  /**
   * Rotina para realizar o download dos arquivos
  */
 app.post("/data/download", [app.models.clientData.validate('download'), app.middlewares.passport.auth('auth-login')],
 async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: {msg: errors.array()[0].msg} });
      }
      const result = await app.models.clientData.downloadFile(req.body, (err)=>{
        app.utils.error.check400(err, res)
      });
      if (!app.utils.error.check400(result, res)) {                
          res.setHeader("Content-disposition", `attachment;`); 
          //res.contentType("application/pdf");                
          
          res.on('error', err => {
            console.log(err)
            app.utils.error.check400(err, res)
          })
          result.pipe(res);
      }           
   } catch (err) { 
       app.utils.error.check400(err, res)
   } 
 }); 

 /**
   * Rotina para retornar a logintude e latitude para atualização do sistema
  */
  app.get("/data/coordenates", app.middlewares.passport.auth('auth-login'),
    async (req, res) => {
      try {
          const result = await app.models.clientData.getCoordenates(req.user)
          if (!app.utils.error.check400(result, res)) {
              res.status(200).send(result) 
          }
      } catch (err) { 
          app.utils.error.check400(err, res)
      } 
    })
}
