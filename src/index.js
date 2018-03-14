const path = require( 'path' );

const createConfig = require( './create-config' );

let configApi = () => {};
let serverData = {};
let clientData = {};

const configPath = process.env.CALYPSO_CONFIG_PATH || path.join( process.cwd(), 'config' );
if ( configPath ) {
	const data = require( './parser' )( configPath, {
		env: process.env.CALYPSO_ENV || process.env.NODE_ENV || 'development',
		enabledFeatures: process.env.ENABLE_FEATURES,
		disabledFeatures: process.env.DISABLE_FEATURES
	} );

	serverData = data.serverData;
	clientData = data.clientData;
	configApi = createConfig( serverData );
} else {
	if ( 'development' === process.env.NODE_ENV ) {
		throw new ReferenceError( '`CALYPSO_CONFIG_PATH` environment variable not defined or empty. Please see calypso-config\'s `README.md` for more details.' );
	}
}

module.exports = configApi;
module.exports.serverData = serverData;
module.exports.clientData = clientData;
