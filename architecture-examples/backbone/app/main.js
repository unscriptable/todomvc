/*jshint unused:false */

// there seems to be a bug in backbone.min when used as CommonJS in a browser.
// this fixes it:
require('backbone').$ = require('jquery');

var View = require('./View');
var router = require('./router');

new View();
