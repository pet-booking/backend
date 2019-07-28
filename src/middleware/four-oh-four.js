// DEPENDENCIES
import createError from 'http-errors'

// INTERFACE
export default (req, res, next) => {
  return next(createError(404, `USER ERROR: ${req.url} not a route`))
}
