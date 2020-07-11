'use strict'
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(require('bluebird'))

const trimParam = str => (typeof str === 'string' ? str.trim() : undefined)
const fileName = file => `${file.name.split('.')[0]}_${file.hash}${file.ext}`

module.exports = {
  init(providerOptions) {
    const wasabi = new AWS.S3({
      accessKeyId: trimParam(providerOptions.key),
      apiVersion: '2006-03-01',
      endpoint: new AWS.Endpoint('s3.wasabisys.com'),
      params: {
        Bucket: providerOptions.bucket
      },
      region: trimParam(providerOptions.region),
      secretAccessKey: trimParam(providerOptions.secret)
    })

    return {
      async upload(file) {
        try {
          await wasabi.upload({
            Key: fileName(file),
            Body: Buffer.from(file.buffer, 'binary'),
            ACL: 'public-read',
            ContentType: file.mime
          }).promise()
          return Promise.resolve()
        } catch (err) {
          if (process.env.DEBUG) console.error(err)
          return Promise.reject(err)
        }
      },
      async delete(file) {
        try {
          await wasabi.deleteObject({
            Key: fileName(file)
          }).promise()
          return Promise.resolve()
        } catch (err) {
          if (process.env.DEBUG) console.error(err)
          return Promise.reject(err)
        }
      }
    }
  }
}
