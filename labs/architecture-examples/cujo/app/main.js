/*global define */
define({
	// Cujo uses OOCSS principles and thus separates theme (skin)
	// from structure CSS.
	theme: { module: 'css!theme/base.css' },

	// The root node where all the views will be inserted
	root: { $ref: 'dom!todoapp' },

	// Render and insert the create view
	createView: {
		create: {
			module: 'bard/model',
			args: [
				{ $ref: 'createViewNode' },
				{
					qsa: { $ref: 'all!' },
					binder: { $ref: 'createViewBinder' },
					proxy: { $ref: 'metadata.model' }
				}
			]
		}
	},

	// Render and insert the list of todos, linking it to the
	// data and mapping data fields to the DOM
	listView: {
		create: {
			module: 'bard/array',
			args: [
				{ $ref: 'listViewNode' },
				{
					sortBy: 'dateCreated',
					qsa: { $ref: 'dom.all!' },
					binder: { $ref: 'listViewBinder' },
					proxy: { $ref: 'metadata.model' }
				}
			]
		}
	},

	// Render and insert the "controls" view--this has the todo count,
	// filters, and clear completed button.
	controlsView: {
		render: {
			template: { module: 'text!app/controls/template.html' },
			replace: { module: 'i18n!app/controls/strings' },
			css: { module: 'css!app/controls/structure.css' }
		},
		insert: { after: 'listViewNode' }
	},

	// Render and insert the footer.  This is mainly static text, but
	// is still fully internationalized.
	footerView: {
		render: {
			template: { module: 'text!app/footer/template.html' },
			replace: { module: 'i18n!app/footer/strings' }
		},
		insert: { after: 'root' }
	},

	// Create a localStorage adapter that will use the storage
	// key 'todos-cujo' for storing todos.  This is also linked,
	// creating a two-way linkage between the listView and the
	// data storage.
	metadata: { $ref: 'todos.metadata' },
	todos: {
		// TODO: validateTodo, cleanTodo, generateMetadata
		create: {
			module: 'cola/etc/backbone/CollectionAdapter',
			args: {
				create: 'app/TodoList',
				properties: {
					localStorage: {
						create: {
							module: 'BackboneLocalStorage',
							args: 'todos'
						}
					}
				}
			}
		}
	},

	mediator: {
		create: {
			module: 'cola/Mediator',
			args: [{ $ref: 'todos' }, { $ref: 'todoController' }]
		},
		ready: {
			notify: { $ref: 'listView' }
		}
	},

	// The main controller, which is acting more like a mediator in this
	// application by reacting to events in multiple views.
	// Typically, cujo-based apps will have several (or many) smaller
	// view controllers. Since this is a relatively simple application,
	// a single controller fits well.
	todoController: {
		create: 'app/controller',
		properties: {
			_querySelector: { $ref: 'first!' },

			masterCheckbox: { $ref: 'dom.first!#toggle-all', at: 'listViewNode' },
			countNode: { $ref: 'dom.first!.count', at: 'controlsView' },
			remainingNodes: { $ref: 'dom.all!#todo-count strong', at: 'controlsView' }
		},
		on: {
			createViewNode: {
				'submit:form': 'createView.get | cleanTodo | generateMetadata | createTodo'
			},
			listViewNode: {
				'click:.destroy': 'listView.find | removeTodo',
				'change:.toggle': 'listView.find | updateTodo',
				'click:#toggle-all': 'toggleAll'
			},
			controlsView: {
				'click:#clear-completed': 'removeCompleted'
			}
		},
		after: {
			'listView.update': 'updateCount',
			'listView.set': 'updateCount'
		},
		connect: {
			_updateTotalCount: 'setTodosTotalState',
			_updateRemainingCount: 'setTodosRemainingState',
			_updateCompletedCount: 'setTodosCompletedState'
		}
	},

	createViewBinder: {
		create: {
			module: 'bard/bind/bySelectorMap',
			args: {
				qsa: { $ref: 'all!' },
				bindings: {
					text: '[name="text"]'
				}
			}
		}
	},
	createViewNode: {
		render: {
			template: { module: 'text!app/create/template.html' },
			replace: { module: 'i18n!app/create/strings' }
		},
		insert: { first: 'root' }
	},

	// Hook up the form to auto-reset whenever a new todo is added
	createForm: {
		element: { $ref: 'dom.first!form', at: 'createViewNode' },
		after: { 'todoController.createTodo': 'reset' }
	},

	listViewBinder: {
		create: {
			module: 'bard/bind/bySelectorMap',
			args: {
				qsa: { $ref: 'dom.all!' },
				bindings: {
					completed: { selector: '.toggle', attr: 'checked' },
					text: 'label, .edit'
				}
			}
		}
	},
	listViewNode: {
		render: {
			template: { module: 'text!app/list/template.html' },
			replace: { module: 'i18n!app/list/strings' },
			css: { module: 'css!app/list/structure.css' }
		},
		insert: { after: 'createViewNode' }
	},

	cleanTodo: { module: 'app/create/cleanTodo' },
	generateMetadata: { module: 'app/create/generateMetadata' },

	toggleEditingState: {
		create: {
			module: 'wire/dom/transform/toggleClasses',
			args: {
				classes: 'editing'
			}
		}
	},

	setTodosTotalState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'todos' }
		}
	},

	setTodosRemainingState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'remaining' }
		}
	},

	setTodosCompletedState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'completed' }
		}
	},

	plugins: [ 'wire/debug',
		'wire/dom', 'wire/dom/render', 'wire/on',
		'wire/aop', 'wire/connect'
	]
});
