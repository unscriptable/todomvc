define(['curl'], function (curl) {
'use strict';

// package config types
var cjs = { moduleLoader: 'curl/loader/cjsm11' };
var css = { moduleLoader: 'curl/plugin/link' };

curl.config({
	baseUrl: '',
	packages: {
		app: { location: 'app', config: cjs },
		curl: { location: 'bower_components/curl/src/curl', main: '../curl' },
		theme: { location: 'bower_components/todomvc-common', config: css },
		backbone: {
			location: 'bower_components/backbone',
			main: 'backbone-min',
			config: cjs
		},
		underscore: {
			location: 'bower_components/underscore',
			main: 'underscore-min',
			config: cjs
		},
		LocalStorage: {
//			main: 'backbone.localStorage-min',
//			config: cjs,
			location: 'bower_components/backbone.localStorage',
			main: 'backbone.localStorage'
		}
	},
	paths: {
		jquery: 'bower_components/jquery/jquery.min'
	}
});

curl(['app', 'theme/base']).then(successed, failed);

function successed (app) {
	app.create();
	app.start();
}

function failed (ex) {
	console.log('ouch. :(', ex);
	throw ex;
}

});
