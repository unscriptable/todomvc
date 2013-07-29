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
var Router = require('./router');
var LocalStorage = require('LocalStorage');
var todoFilter = require('./todos/filter');


// Compose application

var todos = new TodoList({
	model: Todo,
	localStorage: new LocalStorage('todos-backbone')
});

var router = new Router({
	todos: todos,
	todoFilter: todoFilter
});

new AppView({
	todos: todos,
	todoFilter: todoFilter,
	TodoView: TodoView,
	statsTemplate: _.template(statsHtml),
	todoTemplate: _.template(todoHtml),
	$toggleAll: $('#toggle-all'),
	$newTodo: $('#new-todo'),
	$todoList: $('#todo-list'),
	$footer: $('#footer'),
	$main: $('#main')
});
