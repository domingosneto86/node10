module.exports = app => {
    const STATUS = Object.freeze({
        INACTIVE:   0,
        ACTIVE:     1
    })

    const STATUS_NAME = Object.freeze({
        0: 'Inativo',
        1: 'Ativo'
    })
    
    return { STATUS, STATUS_NAME }
}