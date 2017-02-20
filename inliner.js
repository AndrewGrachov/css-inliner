const css = require('css');
const argv = require('yargs').argv;
const jsdom = require('jsdom');
const fs = require('fs');
const filename = argv._[0];
if (!filename) {
	throw new Error('Please specify filename')
}

function parseStyleAttr(styleString) {
	return styleString.split(';').reduce(function (memo, str) {
		let key = str.split(':')[0];
		memo[key] = str.split(':')[1];
	}, {});
}
//attr?

let contents = fs.readFileSync(process.cwd() + '/' + filename).toString();
jsdom.env(
	contents,
	function (err, window) {
		if (err) {
			throw err;
		}
		let classArr = [];
		var document = window.document;
		var elements = document.querySelectorAll('style');
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var html = element.innerHTML;
			var obj = css.parse(html);
			console.log('obj:', JSON.stringify(obj, null, '\t'));
			var classes = obj.stylesheet.rules;
			classes.forEach(function (cssclass) {
				let styleObj = {};
				let selectors = cssclass.selectors;
				cssclass.declarations.forEach(function (declaration) {
					styleObj[declaration.property] = declaration.value;
				});
				console.log('styleObj: ', styleObj);
				classArr.push({
					selectors,
					styleObj
				});
			});
		}

		console.log('classes:', classArr);

	}
);