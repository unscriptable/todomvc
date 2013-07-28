/*global Backbone */
'use strict';

var Backbone = require('backbone');
var todos = require('./todos/todos');
var todoFilter = require('./todos/filter');

// Todo Router
// ----------
var Workspace = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function (param) {
		// Set the current filter to be used
		todoFilter.filter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Todo view items
		todos.trigger('filter');
	}
});

module.exports = new Workspace();
Backbone.history.start();
