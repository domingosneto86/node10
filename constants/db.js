module.exports = app => {

    const TABLE = Object.freeze({
        USER:     'usuario',
        CLIENT:   'cliente',
        DATA:     'cliente_data',
        PARAMETER:'parametro',     
        USER_CLIENT: 'usuario_cliente'     
    })

    return { TABLE }
}