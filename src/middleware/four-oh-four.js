// DEPENDENCIES
import createError from 'http-errors'

// INTERFACE
export default (req, res, next) => {
  res.send('404 Not Found :(')
  return next(createError(404, `USER ERROR: ${req.url} not a route`))
}
