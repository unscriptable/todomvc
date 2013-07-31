(function (buster, define) {

var assert, refute;

assert = buster.assert;
refute = buster.refute;

define(function (require) {

	var _native = require('../../proxy/native');

	var obj, array, defNative;

	obj = {
		one: {
			two: {
				three: 3
			}
		}
	};

	array = [
		{ string: 'foo' },
		{ number: 1 },
		{ date: new Date() },
		obj
	];

	obj.array = array;

	defNative = _native();

	buster.testCase('proxy/_native', {
//		'should fail silently when reading from primitives': function () {
//			refute.exception(function () { _native().get(5, 'foo'); });
//		},
//		'should fail silently when writing to primitives': function () {
//			refute.exception(function () { _native().set(5, 'foo', 3); });
//		},
		'should support dot syntax to read an object property': function () {
			assert.equals(3, defNative.get(obj, 'one.two.three'));
		},
		'should support dot syntax to write an object property': function () {
			defNative.set(obj, 'one.two.three', 'three');
			assert.equals('three', obj.one.two.three);
			defNative.set(obj, 'one.two.three', 3);
		},
		'should support bracket syntax to read an object property': function () {
			assert.equals(3, defNative.get(obj, '["one"]["two"]["three"]'));
		},
		'should support bracket syntax to write an object property': function () {
			defNative.set(obj, '["one"]["two"]["three"]', 'three');
			assert.equals('three', obj.one.two.three);
			defNative.set(obj, '["one"]["two"]["three"]', 3);
		},
		'should support bracket syntax to read an array item': function () {
			assert.equals(1, defNative.get(obj, 'array[1].number'));
			assert.equals(3, defNative.get(array, '[3].one.two.three'));
		},
		'should throw if path is too long or doesn\'t match structure': function () {
			assert.exception(function () { defNative.get(obj, 'array[1].foofoo.blah'); });
			assert.exception(function () { defNative.set(obj, 'array[1].foofoo.doh', 3); });
		},
		'should construct structure from path': function () {
			var obj = defNative.set({}, 'one["two"].three', 3, true);
			assert.equals(obj, { one: { two: { three: 3 } } });
		}
	});

});
}(
	this.buster || require('buster'),
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
