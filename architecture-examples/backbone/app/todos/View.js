'use strict';

var Backbone = require('backbone');

var ENTER_KEY = 13;

// Todo Item View
// --------------

// The DOM element for a todo item...
module.exports = Backbone.View.extend({
	// The TodoView listens for changes to its model, re-rendering. Since there's
	// a one-to-one correspondence between a **Todo** and a **TodoView** in this
	// app, we set a direct reference on the model for convenience.
	initialize: function (options) {
		this.todoTemplate = options.todoTemplate;

		this.listenTo(this.model, 'change', this.change);
		this.listenTo(this.model, 'destroy', this.destroy);
	},

	// Re-render the titles of the todo item.
	render: function () {
		this.$el.html(this.todoTemplate(this.model.toJSON()));
		this.$el.toggleClass('completed', this.model.get('completed'));
		this.$input = this.$('.edit');
		return this;
	},

	change: function () {
		return this.render();
	},

	// Toggle the `"completed"` state of the model.
	toggleCompleted: function () {
		this.model.toggle();
	},

	// Switch this view into `"editing"` mode, displaying the input field.
	edit: function () {
		this.$el.addClass('editing');
		this.$input.focus();
	},

	// Close the `"editing"` mode, saving changes to the todo.
	close: function () {
		var value = this.$input.val().trim();

		if (value) {
			this.model.save({ title: value });
		} else {
			this.clear();
		}

		this.$el.removeClass('editing');
	},

	// If you hit `enter`, we're through editing the item.
	updateOnEnter: function (e) {
		if (e.which === ENTER_KEY) {
			this.close();
		}
	},

	destroy: function (todo) {
		this.remove(todo);
	},

	// Remove the item, destroy the model from *localStorage* and delete its view.
	clear: function () {
		this.model.destroy();
	}
});
