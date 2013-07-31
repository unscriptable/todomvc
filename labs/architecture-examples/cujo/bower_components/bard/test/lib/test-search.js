(function (define) {
define(function (require) {

var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;

var search = require('../../lib/search');

var array1 = [ 2, 4, 4, 4, 6, 8 ];
var array2 = [ 2.3, 4.1, 4.2, 4.3, 6.0, 6.4, 8.9 ];

buster.testCase('search', {

	'binary()': {
		'should find the correct sort position': function () {
			assert.equals(findInsertPosOf(0, array1), 0, 'for 0 into ' + array1);
			assert.equals(findInsertPosOf(2, array1), 1, 'for 2 into ' + array1);
			assert.equals(findInsertPosOf(5, array1), 4, 'for 7 into ' + array1);
			assert.equals(findInsertPosOf(6, array1), 5, 'for 7 into ' + array1);
			assert.equals(findInsertPosOf(7, array1), 5, 'for 7 into ' + array1);
			assert.equals(findInsertPosOf(8, array1), 6, 'for 8 into ' + array1);
			assert.equals(findInsertPosOf(10, array1), 6, 'for 10 into ' + array1);
			assert.equals(findInsertPosOf(-1, array1), 0, 'for -1 into ' + array1);
		}
	},

	'grope()': {
		'should find exact position': function () {
			assert.equals(findExactPos(2.3, array2), 0, 'for 2.3 of ' + array2);
			assert.equals(findExactPos(4.1, array2), 1, 'for 4.1 of ' + array2);
			assert.equals(findExactPos(4.2, array2), 2, 'for 4.2 of ' + array2);
			assert.equals(findExactPos(4.3, array2), 3, 'for 4.3 of ' + array2);
			assert.equals(findExactPos(6.0, array2), 4, 'for 6.0 of ' + array2);
			assert.equals(findExactPos(6.4, array2), 5, 'for 6.4 of ' + array2);
			assert.equals(findExactPos(8.9, array2), 6, 'for 8.9 of ' + array2);
			assert.equals(findExactPos(1.0, array2), -1, 'for 1.0 of ' + array2);
			assert.equals(findExactPos(10.0, array2), -1, 'for 10.0 of ' + array2);
		}
	}

	// TODO: assert that test/compare function is never called too mahy times

});

function findInsertPosOf (val, arr) {
	return search.binary(0, arr.length, compare);
	function compare (test) {
		return val < arr[test] ? -1 : val > arr[test] ? 1 : 0;
	}
}


function findExactPos (val, arr) {
	var approx = findInsertPosOf(val, arr);
	return search.grope(approx, 0, arr.length, match, compare);
	function match (test) {
		return val == arr[test];
	}
	function compare (test) {
		// puts multiple items into the same slot (cuz floor)
		return Math.floor(val) < Math.floor(arr[test])
			? -1
			: Math.floor(val) > Math.floor(arr[test]) ? 1 : 0;
	}
}

});
})(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
);
