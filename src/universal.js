/** @format */

/**
 * Internal dependencies
 */
const createConfig = require( './create-config' );
const { applyUrlOverrides } = require('./overrides');

/**
 * Manages config flags for various deployment builds
 */
if ( 'undefined' === typeof window || ! window.configData ) {
	throw new ReferenceError(
		'No configuration was found: please see calypso-config\'s `README.md` for more information'
	);
}


module.exports = url => {
	const isSSR = typeof self === 'undefined';

	let configData = null;

	if ( isSSR ) {
		configData = require( './index' ).clientData;
	} else {
		if ( ! window.configData ) {
			throw new ReferenceError(
				'No configuration was found: please see calypso-config\'s `README.md` for more information'
			);
		}

		configData = window.configData;
	}

	applyUrlOverrides( url, configData )

	const configApi = createConfig( configData );

	return {
		config: configApi,
		isEnabled: configApi.isEnabled,
	};
}
