// DEPENDENCIES
const createError = require('http-errors')

// INTERFACE
module.exports = (req, res, next) => {
  return next(createError(404, `USER ERROR: ${req.url} not a route`))
}
