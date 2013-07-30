/*global define */
define(function () {
	'use strict';

	var textProp, updateRemainingCount;

	/**
	 * Self-optimizing function to set the text of a node
	 */
	updateRemainingCount = function (nodes, value) {
		// sniff for proper textContent property
		textProp = 'textContent' in document.documentElement ? 'textContent' : 'innerText';

		// resume normally
		updateRemainingCount = setTextProp;
		updateRemainingCount(nodes, value);
	};

	function setTextProp(nodes, value) {
		for (var i = 0; i < nodes.length; i++) {
			nodes[i][textProp] = '' + value;
		}
	}

	return {
		createTodo: function (todos, todo) {
			todos.create(todo);
		},

		removeTodo: function (todos, todo) {
			todo = todos.get(todo);
			todo && todo.destroy();
		},

		updateTodo: function (todos, todo) {
			todo.save({ completed: !todo.get('completed') });
		},

		removeCompleted: function (todos) {
			todos.filter(function(todo) {
				return todo.get('completed');
			}).forEach(function(todo) {
				todo.destroy();
			});
		},

		toggleAll: function (todos) {
			var complete = this.masterCheckbox.checked;

			todos.forEach(function (todo) {
				todo.save({ completed: complete });
			});
		},

		/**
		 * Update the remaining and completed counts, and update
		 * the check/uncheck all checkbox if all todos have become
		 * checked or unchecked.
		 */
		updateCount: function (todos) {
			var total, checked;

			total = 0;
			checked = 0;

			todos.forEach(function (todo) {
				total++;

				if (todo.get('completed')) {
					checked++;
				}
			});

			this.masterCheckbox.checked = total > 0 && checked === total;

			this._updateTotalCount(total);
			this._updateCompletedCount(checked);

			this._updateRemainingCount(total - checked);
		},

		_updateTotalCount: function () {},

		_updateCompletedCount: function (completed) {
			this.countNode.innerHTML = completed;
		},

		_updateRemainingCount: function (remaining) {
			updateRemainingCount(this.remainingNodes, remaining);
		}

	};

});
