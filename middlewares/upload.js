const multer = require('multer')

module.exports = app => {

    return multer({
        limits: {
            fileSize: 10000000
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(zip)$/)){
                return cb(new Error(app.constants.message.INVALID_FILE_FORMAT))
            }

            cb(undefined, true)
        }
    })
}