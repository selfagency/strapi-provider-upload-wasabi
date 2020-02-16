const dotenv = require('dotenv')
const AWS = require('aws-sdk')
const fs = require('fs')
const consola = require('consola')
const proxy = require('proxy-agent')

dotenv.config()
AWS.config.logger = consola
// AWS.config.setPromisesDependency(require('bluebird'))
AWS.config.update({
  httpOptions: { agent: proxy('http://127.0.0.1:9090') }
})

const config = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  bucket: process.env.BUCKET,
  endpoint: process.env.ENDPOINT,
  region: process.env.REGION,
  file: {
    name: 'test',
    ext: 'png',
    hash: '12345',
    mime: 'image/png',
    body: fs.createReadStream('./test.png')
  }
}

config.file.body.on('error', err => {
  console.error(err)
})

const wasabi = new AWS.S3({
  accessKeyId: config.accessKeyId,
  apiVersion: '2006-03-01',
  endpoint: new AWS.Endpoint(config.endpoint),
  region: config.region,
  secretAccessKey: config.secretAccessKey,
  sslEnabled: true,
  params: {
    Bucket: config.bucket
  }
})

const upload = async file => {
  const filename = `${file.path ? file.path + '/' : ''}${file.name}_${file.hash}.${file.ext}`

  try {
    const res = wasabi.putObject(
      {
        Key: filename,
        Body: file.body,
        ACL: 'public-read',
        ContentType: file.mime
      },
      (err, data) => {
        if (err) throw err
        if (data) console.log(data)
      }
    )
    return res
  } catch (err) {
    console.error(err)
    return err
  }
}

upload(config.file)
