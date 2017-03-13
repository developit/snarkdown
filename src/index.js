const TAGS = {
	'' : ['<em>','</em>'],
	_ : ['<strong>','</strong>'],
	'\n' : ['<br />'],
	' ' : ['<br />'],
	'-': ['<hr />']
};

/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */
function outdent(str) {
	return str.replace(RegExp('^'+(str.match(/^(\t| )+/) || '')[0], 'gm'), '');
}

/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */
function encodeAttr(str) {
	return (str+'').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Moved links to global scope
// This allows all block parsers to handle reference urls
//
// I'm not sure that this is a good solution, maybe urls should
// be passed as second parameter to parse fn for nested parses?
//
// function parse(md, links) {
// ...
//     let links = links || {};
// ...
// }
let links = {};

/** Parse Markdown into an HTML String. */
export default function parse(md) {
	// let tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|(\[)|(\](?:\(([^\)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,3})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*])/gm,

	// 1. changed code regexp
	//    from (?:^```(\w*)\n([\s\S]*?)\n```$)
	//    to   (?:(?:^|\n+)```(\w*)\n([\s\S]*?)\n```$)

	// 2. changed inline regexp
	//    from (  \n\n*|\n{2,}|__|\*\*|[_*])
	//    to   (  \n\n*|__|\*\*|[_*])
	//
	//    (not shure what '  \n\n*' does)

	// 3. added two paragraph regexes
	//
	//    one targets usual case, start of string or lots of newlines folowed by text,
	//    followed by 2+ newlines - ((?:^|\n+)(?:[\s\S]+?)(?=\n{2,}))
	//
	//    second targets specifically last paragraph in group (\n+[\s\S]+)

	// 4. changed end of both regexps for headings
	//    from (?:\n+|$)
	//    to   (?=\n+|$)
	//
	//    (it leaves newlines for paragraphs untouched)

	// 5. changed end of <hr /> regexp
	//    from \n
	//    to   (?=\n)
	//
	//    (again, it leaves newlines untouched for paragraphs)

	let tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)(?=\n))|(?:(?:^|\n+)```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|(\[)|(\](?:\(([^\)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?=\n+|$))|(?:(?:^|\n+)(#{1,3})\s*(.+)(?=\n+|$))|(?:`([^`].*?)`)|(  \n\n*|__|\*\*|[_*])|((?:^|\n+)(?:[\s\S]+?)(?=\n{2,}))|(\n+[\s\S]+)/gm,
		context = [],
		out = '',
		last = 0,
		chunk, prev, token, inner, t, p;

	function tag(token) {
		var desc = TAGS[token.replace(/\*/g,'_')[1] || ''],
			end = context[context.length-1]==token;
		if (!desc) return token;
		if (!desc[1]) return desc[0];
		context[end?'pop':'push'](token);
		return desc[end|0];
	}

	function flush() {
		let str = '';
		while (context.length) str += tag(context[context.length-1]);
		return str;
	}

	// Moved 'trim' to the end of chain because reference links
	// could leave trailing newlines
	md = md.replace(/^\[(.+?)\]:\s*(.+)$/gm, (s, name, url) => {
		links[name.toLowerCase()] = url;
		return '';
	}).replace(/^\n+|\n+$/g, '');

	while ( (token=tokenizer.exec(md)) ) {
		prev = md.substring(last, token.index);
		last = tokenizer.lastIndex;
		chunk = token[0];
		if (prev.match(/[^\\](\\\\)*\\$/)) {
			// escaped
		}
		// Code/Indent blocks:
		else if (token[3] || token[4]) {
			chunk = '<pre class="code '+(token[4]?'poetry':token[2].toLowerCase())+'">'+outdent(encodeAttr(token[3] || token[4]).replace(/^\n+|\n+$/g, ''))+'</pre>';
		}
		// > Quotes, -* lists:
		else if (token[6]) {
			t = token[6];
			if (t.match(/\./)) {
				token[5] = token[5].replace(/^\d+/gm, '');
			}
			inner = parse(outdent(token[5].replace(/^\s*[>*+.-]/gm, '')));
			if (t==='>') t = 'blockquote';
			else {
				t = t.match(/\./) ? 'ol' : 'ul';
				inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>');
			}
			chunk = '<'+t+'>' + inner + '</'+t+'>';
		}
		// Images:
		else if (token[8]) {
			chunk = `<img src="${encodeAttr(token[8])}" alt="${encodeAttr(token[7])}">`;
		}
		// Links:
		else if (token[10]) {
			out = out.replace('<a>', `<a href="${encodeAttr(token[11] || links[prev.toLowerCase()])}">`);
			chunk = flush() + '</a>';
		}
		else if (token[9]) {
			chunk = '<a>';
		}
		// Headings:
		else if (token[12] || token[14]) {
			t = 'h' + (token[14] ? token[14].length : (token[13][0]==='='?1:2));
			chunk = '<'+t+'>' + parse(token[12] || token[15]) + '</'+t+'>';
		}
		// `code`:
		else if (token[16]) {
			chunk = '<code>'+encodeAttr(token[16])+'</code>';
		}
		// Inline formatting: *em*, **strong** & friends
		else if (token[17] || token[1]) {
			chunk = tag(token[17] || '--');
		}
		// Paragraphs
		else if (token[18] || token[19]) {
			p = (token[18] || token[19]).trim();
			// Right now there is a problem with p regexp,
			// lists are included in it too, this checks for list once again.
			// I don't like this solution, but can't come up with other one for
			// this moment
			if (/(?:^|\n)([>*+-]|\d+\.)\s+.*/.test(p)) chunk = parse(p);
			else {
				chunk = '<p>' + parse(p) + '</p>';
			}
		}

		out += prev;
		out += chunk;
	}

	return (out + md.substring(last) + flush()).trim();
}
