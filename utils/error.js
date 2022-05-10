module.exports = app => {

    const check400 = (obj, res) => {
        if (obj) {
            if (obj.systemMessage) {
                res.status(200).send(obj)
                return true
            }
            else if (obj.errors) {
                res.status(400).send(obj)
                return true
            } 
            else if (obj.message) {
                res.status(400).send({ errors: [{ msg: obj.message }] }) 
                return true
            }
        } 
        return false
    }

    const format = (err, functionName) => {
        return { 
            errors: { msg: err.message, functionName }
        }
    }

    const systemMessage = async (key, errorControl) => {
        const message = await app.models.systemMessage.get(key)
        return { 
            systemMessage: message,
            errorControl
        }
    }

    return {
        check400, 
        format, 
        systemMessage
    }
}