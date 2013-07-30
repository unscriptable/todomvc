(function (buster, define) {

var assert, refute;

assert = buster.assert;
refute = buster.refute;

define(function (require) {

	var createAccessors = require('../../lib/createAccessors');

	buster.testCase('createAccessors', {
		'should create an object with push and pull functions': function () {
			var a = createAccessors([], {});
			assert('push' in a, 'has a push function');
			assert('pull' in a, 'has a pull function');
		},
		'should push data to nodes': function () {
			var bindings = fakeBindings();
			var a = createAccessors(bindings, {});
			var provider = this.spy();
			a.push(provider);
			assert.calledWithExactly(
				provider,
				'instructions'
			);
			assert.calledWithExactly(
				provider,
				'person.prefix'
			);
			assert.calledWithExactly(
				provider,
				'person.firstname'
			);
			assert.calledWithExactly(
				provider,
				'person.lastname'
			);
			assert.calledWithExactly(
				provider,
				'person.jedi_master'
			);
		},
		'should pull data from nodes': function () {
			var bindings = fakeBindings();
			var a = createAccessors(bindings, {});
			var receiver = this.spy(console.log.bind(console));
			a.pull(receiver);
			assert.calledWithExactly(
				receiver,
				'instructions', ''
			);
			assert.calledWithExactly(
				receiver,
				'person.prefix', ''
			);
			assert.calledWithExactly(
				receiver,
				'person.firstname', ''
			);
			assert.calledWithExactly(
				receiver,
				'person.lastname', ''
			);
			assert.calledWithExactly(
				receiver,
				'person.jedi_master', false
			);
		}

		// TODO: test that receiver receives correct values (not '' as above)
	});

	function fakeBindings () {
		return [
			{ node: fakeNode(), bind: [['text', 'instructions']] },
			{ node: fakeNode(), bind: [['value', 'person.prefix']] },
			{ node: fakeNode(), bind: [['value', 'person.firstname']] },
			{ node: fakeNode(), bind: [['value', 'person.lastname']] },
			{ node: fakeNode(), bind: [['(empty)', 'person.jedi_master']] }
		];
	}

	function fakeNode () {
		return {
			hasAttribute: function (name) { return name in this; },
			setAttribute: function (name, val) { return this[name] = val; },
			getAttribute: function (name) { return this[name] || ''; },
			removeAttribute: function (name) { delete this[name]; }
		};
	}
});
}(
	this.buster || require('buster'),
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));