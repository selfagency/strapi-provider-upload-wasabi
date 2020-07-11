# strapi-provider-upload-wasabi

> Wasabi provider for Strapi upload

## Install

```shell
yarn add strapi-provider-upload-wasabi
```

In your `.env` file add the following settings:

```shell
WASABI_REGION=your_bucket_region
WASABI_BUCKET=your_bucket_name
WASABI_SECRET=your_access_secret
WASABI_KEY=your_access_key
```

Then, in your preferred editor, open `${project_root}/config/plugins.js` and add the following:

```js
module.exports = ({ env }) => ({
  upload: {
    provider: 'wasabi',
    providerOptions: {
      region: env('WASABI_REGION'),
      bucket: env('WASABI_BUCKET'),
      secret: env('WASABI_SECRET'),
      key: env('WASABI_KEY')
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

Give a ★ if this project helped you!
