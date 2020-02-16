'use strict'
const AWS = require('aws-sdk')
const now = new Date()

AWS.config.setPromisesDependency(require('bluebird'))
const trimParam = str => (typeof str === 'string' ? str.trim() : undefined)
const fileName = file => `${file.name.split('.')[0]}_${file.hash}${file.ext}`

module.exports = {
  provider: 'wasabi',
  name: 'Wasabi',
  auth: {
    public: {
      label: 'Access Key ID',
      type: 'text'
    },
    private: {
      label: 'Secret Access Key',
      type: 'text'
    },
    region: {
      label: 'Region',
      type: 'enum',
      values: ['us-east-1', 'us-east-2', 'us-west-1', 'eu-central-1']
    },
    bucket: {
      label: 'Bucket',
      type: 'text'
    }
  },
  init: config => {
    const wasabi = new AWS.S3({
      accessKeyId: trimParam(config.public),
      apiVersion: '2006-03-01',
      endpoint: new AWS.Endpoint('s3.wasabisys.com'),
      params: {
        Bucket: config.bucket
      },
      region: trimParam(config.region),
      secretAccessKey: trimParam(config.private)
    })

    return {
      upload: file => {
        return new Promise((resolve, reject) => {
          wasabi.upload(
            {
              Key: fileName(file),
              Body: Buffer.from(file.buffer, 'binary'),
              ACL: 'public-read',
              ContentType: file.mime
            },
            (err, data) => {
              if (err) reject(err)
              if (data) {
                if (process.env.DEBUG) console.log(`File upload: ${JSON.stringify(data)}`)
                file.url = data.Location
                resolve()
              }
            }
          )
        })
      },
      delete: file => {
        return new Promise((resolve, reject) => {
          wasabi.deleteObject(
            {
              Key: fileName(file)
            },
            (err, data) => {
              if (err) reject(err)
              if (process.env.DEBUG && data) console.log(data)
              resolve()
            }
          )
        })
      }
    }
  }
}
