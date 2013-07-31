/** @license MIT License (c) copyright 2013 original authors */
(function (define) {
define(function (require) {

	var parentTypes, parents, getFirstTagNameRx, isPlainTagNameRx;

	// elements that could be used as root nodes and their natural parent type.
	parentTypes = {
		'li': 'ul',
		'td': 'tr',
		'tr': 'tbody',
		'tbody': 'table',
		'thead': 'table',
		'tfoot': 'table',
		'caption': 'table',
		'col': 'table',
		'colgroup': 'table',
		'option': 'select'
	};

	parents = {};

	getFirstTagNameRx = /<\s*(\w+)/;
	isPlainTagNameRx = /^[A-Za-z]\w*$/;

	/**
	 * Constructs a DOM node and child nodes from an HTML string.
	 * A plain tag name (e.g. "div", "li", "thead") can be used instead
	 * of HTML if only a single element is desired.
	 * @param {String} source is an html template.
	 * @param {Object} options is for future use.
	 * @returns {HTMLElement}
	 */
	function render (source, options) {
		var el;

		if (isPlainTagNameRx.test(source)) {
			// just 'div' or 'a' or 'tr', for example
			el = document.createElement(source);
		}
		else {
			// create node from html
			el = ElementFromTemplate(source);
		}

		return el;
	}

	return render;

	/**
	 * Creates an element from a text template.  This function does not
	 * support multiple elements in a template.  Leading and trailing
	 * text and/or comments are also ignored.
	 * @private
	 * @param {String} template
	 * @returns {HTMLElement} the element created from the template
	 */
	function ElementFromTemplate (template) {
		var parentName, parent, first, child;

		parentName = getFirstTagName(template);
		parent = parentElement(parentName);
		parent.innerHTML = template;

		// we just want to return first element (nodelists
		// are tricky), so we loop through all top-level children to ensure
		// we only have one.
		// TODO: start using document fragments to handle multiple elements?

		// try html5-ish API
		first = parent.firstElementChild;
		child = parent.lastElementChild;

		// old dom API
		if (!first) {
			child = parent.firstChild;
			while (child) {
				if (child.nodeType == 1 && !first) {
					first = child;
				}
				child = child.nextSibling;
			}
		}

		if (first != child) {
			throw new Error('render() only supports one top-level element per template.');
		}

		return first;
	}

	/**
	 * Finds the first html element in a string, extracts its tag name.
	 * @private
	 * @param {String} template
	 * @returns {String} the parent tag name, or 'div' if none was found.
	 */
	function getFirstTagName (template) {
		var matches;
		matches = template.match(getFirstTagNameRx);
		return matches && matches[1];
	}

	/**
	 * Creates a parent element for the given HTML tag.  Parent elements are
	 * cached and reused.  Creation of a parent element might recursively
	 * cause other parent elements to be created and cached (e.g. tables).
	 * @private
	 * @param {String} tagName
	 * @return {String}
	 */
	function parentElement (tagName) {
		var parentType, parent;
		tagName = tagName.toLowerCase();
		parentType = parentTypes[tagName] || 'div';
		parent = parents[parentType];
		if (!parent) {
			parent = parents[parentType] = document.createElement(parentType);
			if (parentType != 'div') {
				parentElement(parentType).appendChild(parent);
			}
		}
		return parent;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
