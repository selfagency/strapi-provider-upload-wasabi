# strapi-provider-upload-wasabi

> Wasabi provider for Strapi upload

## Install

```shell
yarn add strapi-provider-upload-wasabi
```

In your `.env` file add the following settings:

```shell
WASABI_KEY=your_access_key
WASABI_SECRET=your_access_secret
WASABI_REGION=your_bucket_region
WASABI_BUCKET=your_bucket_name
```

Then, in your preferred editor, open `${project_root}/config/plugins.js` and add the following:

```js
module.exports = ({ env }) => ({
  upload: {
    provider: 'wasabi',
    providerOptions: {
      accessKeyId: env('WASABI_KEY'),
      secretAccessKey: env('WASABI_SECRET'),
      region: env('WASABI_REGION'),
      params: {
        Bucket: env('WASABI_BUCKET')
      }
    }
  }
})
```

To configure per-environment, do the same but in `./config/env/${env}/plugins.js`.

## ?? Contributing

Originally authored by [Daniel Sieradski](https://twitter.com/self_agency).

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://gitlab.com/selfagency/strapi-provider-upload-wasabi/issues).

## Show your support

Give a ?? if this project helped you!
