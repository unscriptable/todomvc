/*jshint unused:false */

// Infrastructure

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

// there seems to be a bug in backbone.min when used as CommonJS in a browser.
// this fixes it:
Backbone.$ = $;


// Application components

var TodoList = require('./todos/TodoList');
var Todo = require('./todos/Todo');
var AppView = require('./View');
var TodoView = require('./todos/View');
var statsHtml = require('text!./stats.html');
var todoHtml = require('text!./todos/todo.html');
var LocalStorage = require('LocalStorage');

// Compose application

var todos = new TodoList({
	model: Todo,
	localStorage: new LocalStorage('todos-backbone')
});

var app = new AppView({
	todos: todos,
	createTodoView: createTodoView,
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
		'*filter': function(param) {
			app.filterAll(param || '');
		}
	}
});

Backbone.history.start();

function createTodoView (todo) {
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
}
