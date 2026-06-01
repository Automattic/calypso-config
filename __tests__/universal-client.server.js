/**
 * @jest-environment node
 */

const { URL } = require( 'url' );

/** @format */
/**
 * Internal dependencies
 */
const universalClient = require( 'universal-client' );

describe( 'universal-client on server', () => {
	it( 'should return config with valid path on the server', () => {
		process.env.CALYPSO_CONFIG_PATH = require( 'path' ).resolve( __dirname, '..', 'sample-config' );

		const { config } = universalClient( new URL( 'https://example.com' ) );

		expect( config( 'env_id' ) ).toEqual( 'test' );
	} );
} );
