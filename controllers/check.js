module.exports = app => {
    /**
     * para verificar se a rotina esta no ar
    */
    app.get("/check",
      async (req, res) => {
        try {
            const result = {"status": "ok"}
            if (!app.utils.error.check400(result, res)) {
                res.status(200).send(result) 
            }
        } catch (err) { 
            app.utils.error.check400(err, res)
        } 
      });   
}