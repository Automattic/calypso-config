/** @format */

/**
 * Internal dependencies
 */

const createConfig = require( './create-config' );
const { applyUrlOverrides } = require( './overrides' );

/**
 * Manages config flags for various deployment builds
 */
if ( 'undefined' === typeof window || ! window.configData ) {
	throw new ReferenceError(
		'No configuration was found: please see calypso-config\'s `README.md` for more information'
	);
}

const configData = applyUrlOverrides( window.location.href, window.configData );

const configApi = createConfig( configData );

module.exports = configApi;
module.exports.isEnabled = configApi.isEnabled;
