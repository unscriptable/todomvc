// Bootstrap the app. Notice that curl is not a global, only define.
/*global define*/
define(['curl'], function (curl) {
	'use strict';

	curl({
		main: 'wire!app/main',
		paths: {
			underscore: 'bower_components/underscore-amd/underscore',
			jquery: 'bower_components/jquery/jquery'
		},
		packages: [
			{ name: 'curl', location: 'bower_components/curl/src/curl' },
			{ name: 'wire', location: 'bower_components/wire', main: 'wire' },
			{ name: 'when', location: 'bower_components/when', main: 'when' },
			{ name: 'meld', location: 'bower_components/meld', main: 'meld' },
			{ name: 'cola', location: 'bower_components/cola' },
			{ name: 'bard', location: 'bower_components/bard' },
			{ name: 'poly', location: 'bower_components/poly', main: 'poly' },
			{ name: 'backbone', location: 'bower_components/backbone-amd', main: 'backbone' },
			{ name: 'BackboneLocalStorage', location: 'bower_components/backbone.localStorage', main: 'backbone.localStorage' }
		],
		preloads: ['poly/es5'],
		// Turn off i18n locale sniffing. Change or remove this line if you want to
		// test specific locales or try automatic locale-sniffing.
		locale: false
	});
});
