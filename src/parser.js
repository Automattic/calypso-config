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

	const data = configFiles.reduce( ( combinedData, file ) => {
		const fileData = getDataFromFile( file );
		const features = Object.assign( {}, combinedData.features );
		const mergedData = Object.assign( combinedData, fileData );

		if ( fileData.hasOwnProperty( 'features' ) ) {
			mergedData.features = Object.assign( features, fileData.features );
		}

		return mergedData;
	}, {} );

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
