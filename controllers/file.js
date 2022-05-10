module.exports = app => {
    /**
     * Envia o email com o link para download dos dados
    */
    app.post("/exportemail", 
      [app.middlewares.passport.auth('auth-login'), app.middlewares.upload.array('exportfile[]')],
      async (req, res) => {
        try {
            const result = await app.models.file.sendMail(req.files[0], req.user)
            if (!app.utils.error.check400(result, res)) {
                res.status(200).send(result) 
            }
        } catch (err) { 
            app.utils.error.check400(err, res)
        } 
      }); 

    /**
     * Realiza o download do arquivo exportado pelo app
    */
    app.get("/export/:file", 
      async (req, res) => {
        try {
            const result = await app.models.file.download(req.params.file, (err)=>{
                if (err.errors) {
                    app.utils.error.check400(err, res)
                }
              })
            if (!app.utils.error.check400(result, res)) {                
                res.setHeader("Content-disposition", `attachment;`); 
                res.setHeader("Content-Disposition" , "attachment; filename=exportacao.zip");
                
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
}
