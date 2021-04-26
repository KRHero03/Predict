const path = require('path')
const result = require('dotenv').config({ path: path.join(__dirname, '.env') })

if (result.error) throw result.error 

module.exports = {
    env: process.env.ENVIRONMENT,
    dev : {
      mongoURL: process.env.MONGO_DEV_URL,
      googleClientID: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      apiFootballKey: process.env.API_KEY,
      port: process.env.PORT,
    },
    production: {
      mongoURL: process.env.MONGO_PRODUCTION_URL,
      googleClientID: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      apiFootballKey: process.env.API_KEY,
      port: process.env.PORT,
    },
}