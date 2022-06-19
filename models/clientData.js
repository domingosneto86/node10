const { check } = require('express-validator');
const readable = require('stream').Readable;
const AWS = require('aws-sdk');

module.exports = app => {

    const validate = (method) => {
        switch (method) {
          case 'download': 
              return [
                  check('path').exists().withMessage(() => {
                      return app.constants.message.PATH_REQUIRED
                  })                          
              ]    
        }       
    }    

    const getCoordenates = async (user) => {
        try{
            const data = await app.db(app.constants.db.TABLE.CLIENT)
                .select({
                    log: 'cliente.longitude',
                    lat: 'cliente.latitude'
                })
                .where('idcliente', user.clientId)
                .first()

            if(data){
                return data
            }else{
                return {
                    errors: {msg: app.constants.message.CLIENT_NO_DATA}
                }  
            }
        }catch(err){
            console.log(err)
            return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'clienteData.getCoordenates');
        }
    }

    const getVersion = async (id) => {
        try{
            const data = await app.db(app.constants.db.TABLE.DATA)
                .select({
                    version: 'versao',
                    path_clima: 'path_clima',
                    path_biomassa: 'path_biomassa',
                    path_agro: 'path_agro',
                    path_tch: 'path_tch',
                    path_talhoes: 'path_talhoes',
                    path_centroides: 'path_centroides',
                    path_agro_estimativa: 'path_agro_estimativa',
                    path_media: 'path_media', 
                    path_safra: 'path_safra'
                })
                .where('idcliente', id)
                .andWhere('idstatus', app.constants.base.STATUS.ACTIVE)
                .orderBy('versao', 'desc')
                .first()
            if(data){
                data.maps = await getMapFiles(id)
                return data
            }else{
                return {
                    errors: {msg: app.constants.message.CLIENT_NO_DATA}
                }  
            }
        }catch(err){
            console.log(err)
            return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'clienteData.version');
        }
    }

    const getMapFiles = async(userId) => {
        var s3 = new AWS.S3();
        const list = []

        let token = null
        while(true){
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Prefix : 'clientes/'+userId+'/maps/',
            };
            if(token) params.ContinuationToken = token;
            const data = await s3.listObjectsV2(params).promise()
            for(const item of data.Contents){
                list.push({
                    file: item.Key,
                    size: item.Size
                })
            }
            list.sort();

            if(data.IsTruncated)
                token = data.NextContinuationToken
            else
                break
        }
        
        return list
    }

    const downloadFile = async (body, reject) => {
        try{
            const result = await getFile(body.path)
            if(result && result.errors){
                console.log(result)
                return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'clienteData.downloadFile')
            }
                        
            /*return await new Promise((resolve, reject) => {                
                        let stream = new readable();
                        stream.push(result);
                        stream.push(null);
                        resolve(stream);
                    },
                    (err) => {
                        throw err;
                    });*/
            const stream = result.createReadStream()
            stream.on('error', err => {
                console.log(err)
                stream.end()
                reject(app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'clienteData.downloadFile'))
              })
            return stream
        }catch(err){
            console.log(err)
            return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'clienteData.downloadFile');
        }
    }

    const getFile = async (fileKey) => {
        try{
            var s3 = new AWS.S3();
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key : fileKey
            };
    
            const data = s3.getObject(params)//.promise()
            return data//.Body
        }
        catch(err) {
            //chamada interna
            return app.utils.error.format(err, 'clienteData.getFile')
        }
    }

    return { getVersion, validate, downloadFile,getCoordenates }
}