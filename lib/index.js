'use strict'
const AWS = require('aws-sdk')

AWS.config.setPromisesDependency(require('bluebird'))
const trimParam = str => (typeof str === 'string' ? str.trim() : undefined)
const fileName = file => `${file.path ? file.path + '/' : ''}${file.name}_${file.hash}${file.ext}`

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
      upload: async file => {
        try {
          wasabi.putObject(
            {
              Key: fileName(file),
              Body: new Buffer(file.buffer, 'binary'),
              ACL: 'public-read',
              ContentType: file.mime
            },
            (err, data) => {
              if (err) throw err
              if (data) {
                if (process.env.DEBUG) console.log(data)
                file.url = data.Location
              } else {
                if (process.env.DEBUG) console.log('Data is null')
                file.url = null
              }
            }
          )
          return file
        } catch (err) {
          console.error(err)
          return err
        }
      },
      delete: async file => {
        try {
          wasabi.deleteObject(
            {
              Key: fileName(file)
            },
            (err, data) => {
              if (err) throw err
              if (process.env.DEBUG && data) console.log(data)
            }
          )
          return
        } catch (err) {
          console.error(err)
          return err
        }
      }
    }
  }
}
