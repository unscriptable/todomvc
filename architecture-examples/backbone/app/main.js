// Infrastructure

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

// there seems to be a bug in backbone.min when used as CommonJS in a browser.
// this fixes it:
Backbone.$ = $;


// Application components

var TodoList = require('./TodoList');
var todos = require('./todos/main');
var AppView = require('./View');
var statsHtml = require('text!./stats.html');
var LocalStorage = require('LocalStorage');


// Export lifecycle methods

var todoList, app;

exports.create = function () {

	todoList = new TodoList({
		model: todos.Model,
		localStorage: new LocalStorage('todos-backbone')
	});

	app = new AppView({
		todos: todoList,
		createTodoView: todos.create,
		statsTemplate: _.template(statsHtml),
		el: $('#todoapp'),
		$toggleAll: $('#toggle-all'),
		$newTodo: $('#new-todo'),
		$todoList: $('#todo-list'),
		$footer: $('#footer'),
		$main: $('#main'),
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		}
	});

	new Backbone.Router({
		routes: {
			'*filter': function (param) {
				app.filterAll(param || '');
			}
		}
	});

};

// Start application

exports.start = function () {

	Backbone.history.start();
	todoList.fetch();

};
