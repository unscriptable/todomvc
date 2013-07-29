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
	TodoView: TodoView,
	statsTemplate: _.template(statsHtml),
	todoTemplate: _.template(todoHtml),
	el: $('#todoapp'),
	$toggleAll: $('#toggle-all'),
	$newTodo: $('#new-todo'),
	$todoList: $('#todo-list'),
	$footer: $('#footer'),
	$main: $('#main')
});

new Backbone.Router({
	routes: {
		'*filter': function(param) {
			app.filterAll(param || '');
		}
	}
});

Backbone.history.start();
