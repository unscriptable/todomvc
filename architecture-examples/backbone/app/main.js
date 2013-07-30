// Infrastructure

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var meld = require('meld');
var after = meld.after;
var before = meld.before;

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

// Advise components

var todoViews = {}, viewFilter = '';

exports.init = function () {

	before(app, 'filterAll', setFilter);
	after(app, 'filterAll', refreshViews);

	after(app, 'createTodoView', saveTodoView);
	after(app, 'createTodoView', adviseTodoView);
	after(app, 'createTodoView', toggleHidden);

};

// Start application

exports.start = function () {

	todoList.fetch({
		success: function () { Backbone.history.start(); }
	});

};

function setFilter (filter) {
	viewFilter = filter;
}

function refreshViews () {
	for (var cid in todoViews) {
		toggleHidden(todoViews[cid]);
	}
}

function saveTodoView (view) {
	todoViews[view.cid] = view;
}

function adviseTodoView (view) {
	after(view, 'render', toggleHidden);
	before(view, 'remove', function () {
		delete todoViews[view.cid];
	});
}

function toggleHidden (view) {
	var isCompleted = view.model.get('completed');
	var isHidden = (// hidden cases only
		(!isCompleted && viewFilter === 'completed') ||
		(isCompleted && viewFilter === 'active')
	);
	view.toggleVisible(isHidden);
	return view;
}
