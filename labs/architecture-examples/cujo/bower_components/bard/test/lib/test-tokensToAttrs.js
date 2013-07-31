(function (buster, define) {

var assert, refute;

assert = buster.assert;
refute = buster.refute;

define(function (require) {

	var tokensToAttrs = require('../../lib/tokensToAttrs');
	// TODO: ewwww get rid of node-only codez
	var simpleForm = require('fs').readFileSync('../templates/simple-form.html');

	buster.testCase('tokensToAttrs', {
		'should find and convert mustache-style tokens for a form': function () {
			var converted = tokensToAttrs(simpleForm);
			assert(
				/<form>\s*<div\s+data-bard-section="person">/.test(converted),
				'converted section tag to attribute'
			);
			assert(
				/<\/div>\s*<\/form>/.test(converted),
				'converted end section tag to div'
			);
			assert(
				/name="first"[^>]+data-bard-bind="value:person.firstname"/.test(converted),
				'converted variable tag inside an html tag to an attribute'
			);
			assert(
				/name="last"[^>]+data-bard-bind="value:person.lastname"/.test(converted),
				'converted variable tag inside an html tag to an attribute'
			);
			assert(
				/name="prefix"[^>]+data-bard-bind="value:person.prefix"/.test(converted),
				'converted variable tag inside an html tag to an attribute'
			);
			assert(
				/name="jedi"[^>]+data-bard-bind="\(empty\):person.jedi_master"/.test(converted),
				'converted variable tag inside an html tag to an empty attribute'
			);
			assert(
				/<span\s+data-bard-bind="text:instructions"><\/span>/.test(converted),
				'converted a variable tag outside an html tag to a text attribute'
			);
		}

		// TODO: test templated attributes (more than one mustache tag inside an attribute)
		// TODO: test mustache section tags in more situations

	});

});
}(
	this.buster || require('buster'),
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));