module.exports.applyUrlOverrides = ( url, configData ) => {
	if (
		process.env.NODE_ENV === 'development' ||
		configData.env_id === 'stage' ||
		url.origin === 'https://calypso.live'
	) {
		const match = url.search && url.search.match( /[?&]flags=([^&]+)(&|$)/ );

		if ( match ) {
			const flags = match[ 1 ].split( ',' );
			flags.forEach( flagRaw => {
				const flag = flagRaw.replace( /^[-+]/, '' );
				const enabled = ! /^-/.test( flagRaw );
				configData.features[ flag ] = enabled;
				console.log(
					// eslint-disable-line no-console
					'%cConfig flag %s via URL: %s',
					'font-weight: bold;',
					enabled ? 'enabled' : 'disabled',
					flag
				);
			} );
		}
	}
}