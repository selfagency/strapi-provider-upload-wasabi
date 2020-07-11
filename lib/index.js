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
          const data = await wasabi.upload({
            Key: fileName(file),
            Body: Buffer.from(file.buffer, 'binary'),
            ACL: 'public-read',
            ContentType: file.mime
          }).promise()
          strapi.log.debug('strapi-provider-upload-wasabi::upload: ' + JSON.stringify(data))
          file.url = data['Location']
          return FileReader
        } catch (err) {
          strapi.log.error(err)
          throw err
        }
      },
      async delete(file) {
        try {
          const data = await wasabi.deleteObject({
            Key: fileName(file)
          }).promise()
          strapi.log.debug('strapi-provider-upload-wasabi::delete: ' + JSON.stringify(data))
        } catch (err) {
          strapi.log.error(err)
          throw err
        }
      }
    }
  }
}
