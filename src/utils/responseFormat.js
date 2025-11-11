module.exports.successResponse = (status, error, message, result) => {
    return { status, error, message, result }
}

module.exports.errorResponse = (status = 500, error, message) => {
    return { status, error, message }
}