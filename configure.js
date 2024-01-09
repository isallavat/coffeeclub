const fs = require('fs')
require('dotenv').config()

const env = {
  apiHost: process.env.API_HOST
}

fs.writeFileSync('./src/env.json', JSON.stringify(env, null, 2))
