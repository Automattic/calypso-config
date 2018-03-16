# Config

This library can be used for managing server- and client-side configs.

All configs are stored in `.json` files (see examples in `sample-config`) in a `config` folder in your working directory. This path can be overridden via the `CALYPSO_CONFIG_PATH` environment variable.

At boot-up time, the server decides which config file to use based on the `NODE_ENV` environment variable. The default value is `development`. For values shared across environments, add them to the `_shared.json` file. Local-only values can be added via a `{environment}.local.json` file (e.g. `development.local.json`).

The entire configuration is available on the server-side and certain keys can be exposed to the client.

## Server-side Usage

Config values can be retrieved by invoking the `config()` exported function with the desired key name:

```js
import config from '@automattic/calypso-config';
console.log( config( 'redirect_uri' ) );
```

## Client-side Usage

To access `config` values on the client-side, add the property name to the `client.json` file, which is a whitelist of `config` properties that will be exposed to the client.

A global `configData` object must also be output during the initial render. Here's an example using webpack and the interpolate

In your webpack build config:

```js
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const InterpolateHtmlPlugin = require( 'react-dev-utils/InterpolateHtmlPlugin' );

const clientData = require( '@automattic/calypso-config' ).clientData;

// ...

const interpolateHtmlData = Object.assign( {}, {
	CALYPSO_CONFIG_DATA_AS_JSON: JSON.stringify( clientData ),
} );

// ...

module.exports = {
	// ...

	plugins: [
		new InterpolateHtmlPlugin( interpolateHtmlData ),

		new HtmlWebpackPlugin( {
			inject: true,
			template: '/path/to/index.html',
		} ),
	],

	// ...
}

```

Then, in your `index.html` template:

```html
<html>
  <head>
  ...
  <script>var configData = %CALYPSO_CONFIG_DATA_AS_JSON%;</script>
  ...
  </head>
</html>
```

And finally, to access the configs:

```js
import config from '@automattic/calypso-config/client';

console.log( config( 'redirect_uri' ) );
console.log( config.isEnabled( 'secret-features' ) );
```

## Feature Flags

The config files contain a features object that can be used to determine whether to enable a feature for certain environments. This allows us to merge in-progress features without launching them to production. The config module adds a method to detect this: `config.isEnabled()`. Please make sure to add new feature flags alphabetically so they are easy to find.

```json
{
	"features": {
		"manage/posts": true,
		"reader": true
	}
}
```

### Testing Feature Flags Locally

If you want to temporarily enable/disable some feature flags for a given build, you can do so by setting the `ENABLE_FEATURES` and/or `DISABLE_FEATURES` environment variables. Set them to a comma separated list of features you want to enable/disable, respectively:

```bash
ENABLE_FEATURES=manage/plugins/compatibility-warning DISABLE_FEATURES=code-splitting,reader npm start
```

### Testing Feature Flags via URLs

If you want to temporarily enable/disable some feature flags you can add a `?flags=` query parameter to the URL.

**Note** that this **only** works on development, staging, and calypso.live, **not** in production (this functionality is not suitable for public use on `*.wordpress.com`).

- `?flags=foo` enables feature *foo*.
- `?flags=-bar` disables feature *bar*.
- `?flags=foo,-bar` enables feature *foo* and disables feature *bar*.

E.g. http://calypso.localhost:3000/?flags=manage/plugins/compatibility-warning
