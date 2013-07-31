'use strict';

var Backbone = require('backbone');

var ENTER_KEY = 13;


// The Application
// ---------------

// Our overall **View** is the top-level piece of UI.
module.exports = Backbone.View.extend({

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize: function (options) {
		this.todos = options.todos;
		this.createTodoView = options.createTodoView;
		this.statsTemplate = options.statsTemplate;
		this.todoTemplate = options.todoTemplate;
		this.activeFilter = options.activeFilter || '';

		this.allCheckbox = options.$toggleAll[0];
		this.$input = options.$newTodo;
		this.$todoList = options.$todoList;
		this.$footer = options.$footer;
		this.$main = options.$main;

		this.listenTo(this.todos, 'add', this.addOne);
		this.listenTo(this.todos, 'reset', this.addAll);
		this.listenTo(this.todos, 'change:completed', this.filterOne);
		this.listenTo(this.todos, 'filter', this.filterAll);
		this.listenTo(this.todos, 'all', this.render);
	},

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render: function () {
		var completed = this.todos.completed().length;
		var remaining = this.todos.remaining().length;

		if (this.todos.length) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + this.activeFilter + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.allCheckbox.checked = !remaining;
	},

	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function (todo) {
		var view = this.createTodoView(todo);
		this.$todoList.append(view.el);
	},

	// Add all items in the **Todos** collection at once.
	addAll: function () {
		this.$todoList.html('');
		this.todos.each(this.addOne, this);
	},

	filterOne: function (todo, filter) {
		todo.trigger('visible', filter);
	},

	filterAll: function (filter) {
		this.activeFilter = filter;
		this.todos.each(function(todo) {
			this.filterOne(todo, filter);
		}, this);
	},

	// Generate the attributes for a new Todo item.
	newAttributes: function () {
		return {
			title: this.$input.val().trim(),
			order: this.todos.nextOrder(),
			completed: false
		};
	},

	// If you hit return in the main input field, create new **Todo** model,
	// persisting it to *localStorage*.
	createOnEnter: function (e) {
		if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		this.todos.create(this.newAttributes());
		this.$input.val('');
	},

	// Clear all completed todo items, destroying their models.
	clearCompleted: function () {
		this.todos.completed().forEach(function (todo) { todo.destroy(); });
		return false;
	},

	toggleAllComplete: function () {
		var completed = this.allCheckbox.checked;

		this.todos.each(function (todo) {
			todo.save({
				'completed': completed
			});
		});
	}
});
