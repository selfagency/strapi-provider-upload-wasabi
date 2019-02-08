'use strict';

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash');
const knox = require('knox');
// const {
//   parse,
//   stringify
// } = require('flatted/cjs');

module.exports = {
  provider: 'wasabi-s3',
  name: 'Wasabi',
  auth: {
    public: {
      label: 'Access Key',
      type: 'text'
    },
    private: {
      label: 'Secret Key',
      type: 'text'
    },
    region: {
      label: 'Region',
      type: 'enum',
      values: [
        'us-east-1',
        'us-west-1'
      ]
    },
    bucket: {
      label: 'Bucket',
      type: 'text'
    }
  },
  init: (config) => {
    // configure Wasabi bucket connection

    const wasabi = knox.createClient({
      key: config.public,
      secret: config.private,
      bucket: config.bucket,
      region: config.region,
      endpoint: 's3.wasabisys.com'
    })

    return {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          file.url = `${path}${file.hash}${file.ext}`

          wasabi.putBuffer(new Buffer(file.buffer, 'binary'), file.url, {
            'x-amz-acl': 'public-read',
            'Content-Length': file.size,
            'Content-Type': file.mime
          }, (err, data) => {
            if (err) {
              return reject(err);
            }

            file.url = `https://${config.bucket}.s3.wasabisys.com/${file.url}`;

            resolve();
          });
        });
      },
      delete: (file) => {
        return new Promise((resolve, reject) => {
          // delete file on Wasabi bucket
          const path = file.path ? `${file.path}/` : '';
          file.url = `${path}${file.hash}${file.ext}`

          wasabi.del(file.url,
            (err, data) => {
              if (err) {
                return reject(err);
              }

              resolve();
            });
        });
      }
    };
  }
};