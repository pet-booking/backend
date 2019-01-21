const required = [
  'PORT',
  'SECRET',
  'API_URL',
  'NODE_ENV',
  'MONGODB_URI',
  'CORS_ORIGIN',
]

try {
  required.forEach((key) => {
    if (!process.env[key])
      throw new Error(`ENVIRONMENT ERROR: App requires process.env.${key} to be set`)
  })
} catch (err) {
  console.log(err.message)
  process.exit(1)
}
