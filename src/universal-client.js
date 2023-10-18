/** @format */

/**
 * Internal dependencies
 */
const createConfig = require( './create-config' );
const { applyUrlOverrides } = require( './overrides' );

module.exports = url => {
	const isSSR = typeof window === 'undefined';

	let configData = null;

	if ( isSSR ) {
		configData = require( './index' ).clientData;
	} else {
		configData = window.configData;
	}
	
	if ( ! configData ) {
		throw new ReferenceError(
			'No configuration was found: please see calypso-config\'s `README.md` for more information'
		);
	}

	applyUrlOverrides( url, configData );

	const configApi = createConfig( configData );

	return {
		config: configApi,
		isEnabled: configApi.isEnabled,
	};
}
