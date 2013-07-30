var meld = require('meld');
var after = meld.after;
var before = meld.before;

var todoViews = {}, viewFilter = '';

module.exports = {
	setFilter: setFilter,
	getFilter: getFilter,
	refreshViews: refreshViews,
	saveTodoView: saveTodoView,
	adviseTodoView: adviseTodoView,
	toggleHidden: toggleHidden
};

function setFilter (filter) {
	viewFilter = filter;
}

function getFilter () {
	return viewFilter;
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
