var nodemailer = require('nodemailer');
const readable = require('stream').Readable;
const AWS = require('aws-sdk');

module.exports = app => {

    const sendMail = async (file, user) => {
        try{
            if(!user || !user.email){
                return app.utils.error.format({message: app.constants.message.NO_EMAIL_DEFINED}, 'file.sendMail');
            }
            const filePath = 'clientes/'+user.clientId+'/mails/'
            const fileName = generateUniqueId()
            
            const result = await upload(file.buffer, filePath, `${fileName}.zip`, false)
            if(result && result.errors){
                return result
            }
            
            const fileEmail = await app.utils.crypt.cryptString(filePath+fileName+'.zip')
            await sendMailBody(fileEmail, user.email) 
            return {
                send: true
            }
        }catch(err){
            console.log(err)
            return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'file.sendMail');
        }
    }

    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36)
    } 

    const sendMailBody = async (filePath, userMail) => {
        try{
            const email = await app.db(app.constants.db.TABLE.PARAMETER)
                .select({
                    title: 'titulo',
                    body: 'corpo',
                    emailfrom: 'emailfrom'
                })
                .where('idtipo', app.constants.file.TYPE.EMAIL_EXPORT)
                .andWhere('idstatus', app.constants.base.STATUS.ACTIVE)
                .first()

            if(email){
                var mail = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                const body = email.body.replace('{LINK}', process.env.EMAIL_URL+'export/'+filePath)

                var mailOptions = {
                    from: email.emailfrom,
                    to: userMail,
                    subject: email.title,
                    text: body
                };
                
                mail.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }catch(err){
            return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'file.sendMail');7
        }
    }
//localhost:8081/export/82e9f02f7f285327cda58f97ebf900c230f2fc857238f18799c429feb20a9ac44d557f2decdbec3182722292dadec279
    const download = async (fileParam, reject) => {
        try{
            const fileEmail = await app.utils.crypt.decryptString(fileParam)
            const result = await getFile(fileEmail+'.zip')
            if(result && result.errors){
                console.log(result)
                return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'file.download')
            }
                        
            const stream = result.createReadStream()
            stream.on('error', err => {
                console.log(err)
                stream.end()
                reject(app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'file.download'))
              })
            return stream
        }catch(err){
            console.log(err)
            return app.utils.error.format({message: app.constants.message.DEFAULT_MESSAGE}, 'file.download');
        }
    }

    const getFile = async (fileKey) => {
        try{
            var s3 = new AWS.S3();
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key : fileKey
            };
    
            const data = s3.getObject(params)
            return data
        }
        catch(err) {
            //chamada interna
            return app.utils.error.format(err, 'file.getFile')
        }
    }

    const upload = async (fileBuffer, filePath, fileName, public) => {
        try {
            var s3 = new AWS.S3();
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : fileBuffer,
                Key : filePath + fileName
            };

            if (public) {
                params.ACL = 'public-read'
            }
    
            return await s3.upload(params).promise()
        }
        catch(err) {
            return app.utils.error.format(err, 'file.upload')
        }
    }

    return { sendMail, download }
}