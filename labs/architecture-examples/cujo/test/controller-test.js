var buster, assert, refute, controller, backbone, FakeCollection, sentinel;

buster = require('buster');
assert = buster.assert;
refute = buster.refute;

controller = require('../app/controller');
backbone = require('backbone');
backbone.sync = function() {};
FakeCollection = backbone.Collection.extend();

sentinel = {};

buster.testCase('app/controller', {
	createTodo: {
		'should create todo': function() {
			var todos = new FakeCollection();

			controller.createTodo(todos, { id: 1, value: sentinel });

			assert.same(todos.get(1).get('value'), sentinel);
		}
	},

	removeTodo: {
		'should destroy the todo': function() {
			var todos, todo;

			todos = new FakeCollection();
			todo = todos.create({ id: 1 });

			controller.removeTodo(todos, { id: 1 });

			refute.defined(todos.get(1));
		}
	},

	updateTodo: {
		'should set completed': function() {
			var todos, todo;

			todos = new FakeCollection();
			todo = todos.create({ id: 1, completed: false });

			controller.updateTodo(todos, todo);

			assert(todos.get(1).get('completed'));
		}
	},

	removeCompleted: {
		'should destroy all completed': function() {
			var todos, i;

			todos = new FakeCollection();
			for(i = 0; i < 10; i++) {
				todos.create({ id: i, completed: !!(i % 2) });
			}

			controller.removeCompleted(todos);

			todos.forEach(function(todo) {
				refute(todo.get('completed'));
			});
		}
	},

	toggleAll: {
		'setUp': function() {
			controller.masterCheckbox = { checked: false };
		},

		'tearDown': function() {
			delete controller.masterCheckbox;
		},

		'should ensure all are completed': function() {
			var todos, i;

			todos = new FakeCollection();
			for(i = 0; i < 10; i++) {
				todos.create({ id: i, completed: !!(i % 2) });
			}

			controller.masterCheckbox.checked = true;
			controller.toggleAll(todos);

			todos.forEach(function(todo) {
				assert.equals(todo.get('completed'), controller.masterCheckbox.checked);
			});
		},

		'should ensure none are completed': function() {
			var todos, i;

			todos = new FakeCollection();
			for(i = 0; i < 10; i++) {
				todos.create({ id: i, completed: !!(i % 2) });
			}

			controller.toggleAll(todos);

			todos.forEach(function(todo) {
				assert.equals(todo.get('completed'), controller.masterCheckbox.checked);
			});
		}
	}
})