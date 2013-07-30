(function(define) {
define(function(require) {

	var backbone = require('backbone');

	return backbone.Collection.extend({
		// Skeleton collection for todos, add custom methods
		// here as usual/necessary
		model: backbone.Model.extend({
			defaults: {
				completed: false
			}
		})
	});

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
