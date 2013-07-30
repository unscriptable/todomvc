// Infrastructure

var _ = require('underscore');

// Application components

var TodoView = require('./View');
var todoHtml = require('text!./todo.html');

// Export useful sub-components

exports.Model = require('./Todo');

// Export lifecycle methods

exports.create = function createTodoView (todo) {
	var view = new TodoView({
		model: todo,
		todoTemplate: _.template(todoHtml),
		tagName:  'li',
		events: {
			'click .toggle': 'toggleCompleted',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'blur .edit': 'close',
			'dblclick label': 'edit'
		}
	});
	view.render();
	return view;
};

exports.destroy = function (todo) {
	todo.destroy();
};
