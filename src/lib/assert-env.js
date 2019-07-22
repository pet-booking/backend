const required = [
  'PORT',
  'API_URL',
  'NODE_ENV',
  'MONGODB_URI',
  'CORS_ORIGIN',
  'CLOUD_SECRET',
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
