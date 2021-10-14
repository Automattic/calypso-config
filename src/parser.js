/**
 * Module dependencies
 */
const fs = require( 'fs' ),
	path = require( 'path' );

function getDataFromFile( file ) {
	let fileData = {};

	if ( fs.existsSync( file ) ) {
		fileData = JSON.parse( fs.readFileSync( file, 'utf8' ) );
	}

	return fileData;
}

module.exports = function( configPath, defaultOpts ) {
	let opts = Object.assign( {
			env: 'development',
		}, defaultOpts ),
		data = {},
		configFiles = [
			path.resolve( configPath, '_shared.json' ),
			path.resolve( configPath, opts.env + '.json' ),
			path.resolve( configPath, opts.env + '.local.json' )
		],
		realSecretsPath = path.resolve( configPath, 'secrets.json' ),
		emptySecretsPath = path.resolve( configPath, 'empty-secrets.json' ),
		secretsPath = fs.existsSync( realSecretsPath ) ? realSecretsPath : emptySecretsPath,
		enabledFeatures = opts.enabledFeatures ? opts.enabledFeatures.split( ',' ) : [],
		disabledFeatures = opts.disabledFeatures ? opts.disabledFeatures.split( ',' ) : [];

	configFiles.forEach( function( file ) {
		const fileData = getDataFromFile( file );
		const features = Object.assign( data.features || {}, fileData.features || {} );

		Object.assign( data, fileData );

		if ( fileData.hasOwnProperty( 'features' ) ) {
			data.features = features;
		}
	} );

	if ( data.hasOwnProperty( 'features' ) ) {
		enabledFeatures.forEach( function( feature ) {
			data.features[ feature ] = true;
		} );
		disabledFeatures.forEach( function( feature ) {
			data.features[ feature ] = false;
		} );
	}

	const serverData = Object.assign( {}, data, getDataFromFile( secretsPath ) );
	const clientData = Object.assign( {}, data );

	return { serverData, clientData };
}
