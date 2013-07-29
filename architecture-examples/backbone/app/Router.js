'use strict';

var Backbone = require('backbone');

// Todo Router
// ----------
module.exports = Backbone.Router.extend({

	initialize: function (options) {
		this.todoFilter = options.todoFilter;
		this.todos = options.todos;
		Backbone.history.start();
	},

	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function (param) {
		// Set the current filter to be used
		this.todoFilter.filter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Todo view items
		this.todos.trigger('filter');
	}
});
