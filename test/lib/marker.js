module.exports = (...args) => {
  args[0] = args[0].toUpperCase() || 'HERE'
  console.log('\x1b[45m%s\x1b[0m', `<<--- ${args[0]} --->>`, ...args.slice(1))
}