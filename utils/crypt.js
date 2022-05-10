var crypto = require('crypto');

module.exports = app => { 
    const crypt = (value) => {
        var mykey = crypto.createHash('sha256');
        var mystr = mykey.update(value).digest('hex')
        return mystr;
    } 

    const cryptString = (value) => {
        var mykey = crypto.createCipher('aes-128-cbc', process.env.CRYPTO_KEY);
        var mystr = mykey.update(value, 'utf8', 'hex')
        mystr += mykey.final('hex');
        return mystr;
    } 

    const decryptString = (value) => {
        var mykey = crypto.createDecipher('aes-128-cbc', process.env.CRYPTO_KEY);
        var mystr = mykey.update(value, 'hex','utf8')
        mystr += mykey.final('utf8');
        return mystr;
    } 
    
    return {
        crypt, cryptString, decryptString
    }
}