require('dotenv').config()

const { env: { PORT = 6767, NODE_ENV: env, MONGODB_URL }, argv: [, , port = PORT] } = process

const app = require('express')()
const http = require('http').Server(app)
const { mongoose } = require('./../Js-Drone-DATA')
const winston = require('winston')
const { name, version } = require('./package')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const router = require('./routes')
const { cors } = require('./mid-wares')



mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const logger = winston.createLogger({
      level: env === 'development' ? 'debug' : 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'server.log' })
      ]
    })

    if (env !== 'production') {
      logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }))
    }

    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


    app.use(cors)

    app.use(morgan('combined', { stream: accessLogStream }))

    app.use('/api', router)

    http.listen(port, () => logger.info(`server ${name} ${version} up and running on port ${port}`))

    process.on('SIGINT', () => {
      logger.info('server abruptly stopped')
      process.exit(0)
    })

  })
