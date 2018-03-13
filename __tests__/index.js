describe( 'config', () => {
	it( 'should return config with valid path', () => {
		process.env.CALYPSO_CONFIG_PATH = require( 'path' ).resolve( __dirname, '..', 'sample-config' );

		const config = require( '../src/' );

		expect( config( 'env_id' ) ).toEqual( 'test' );
		expect( config ).toHaveProperty( 'serverData' );
		expect( config ).toHaveProperty( 'clientData' );
	} );

});
