const TAGS = {
	'': ['<em>','</em>'],
	_: ['<strong>','</strong>'],
	'*': ['<strong>','</strong>'],
	'~': ['<s>','</s>'],
	'\n': ['<br />'],
	' ': ['<br />'],
	'-': ['<hr />']
};

/** Outdent a string based on a selected replacement, defaulting to the first indented line's leading whitespace
 *	@private
 */
function outdent(str, replacement) {
	replacement = replacement || str.match(/^(\t| )*/)[0] || '';
	return str.replace(RegExp('^'+(replacement), 'gm'), '');
}

/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */
function encodeAttr(str) {
	return (str+'').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Parse Markdown into an HTML String. */
export default function parse(md, prevLinks) {
	let tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n\s*)([*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)|((?:(?:^|\n)(?:>\s+[^\n]*\n?)+))/gm,
		context = [],
		out = '',
		links = prevLinks || {},
		last = 0,
		chunk, prev, token, inner, t;

	function tag(token) {
		let desc = TAGS[token[1] || ''];
		let end = context[context.length-1] == token;
		if (!desc) return token;
		if (!desc[1]) return desc[0];
		if (end) context.pop();
		else context.push(token);
		return desc[end|0];
	}

	function flush() {
		let str = '';
		while (context.length) str += tag(context[context.length-1]);
		return str;
	}

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
		else if (t = (token[3] || token[4])) {
			chunk = '<pre class="code '+(token[4]?'poetry':token[2].toLowerCase())+'"><code'+(token[2] ? ` class="language-${token[2].toLowerCase()}"` : '')+'>'+outdent(encodeAttr(t).replace(/^\n+|\n+$/g, ''))+'</code></pre>';
		}
		// -* lists:
		else if (t = token[6]) {
			if (t.match(/\./)) {
				token[5] = token[5].replace(/^\d+/gm, '');
			}
			t = t.match(/\./) ? 'ol' : 'ul';
			chunk = '<'+t+'><li>';
			let firstIndent = '';
			let currentSublist = '';
			let firstItemCreated = false;

			token[5].replace(/^(\s*)(?:[*+.-]|\d+\.)\s+(.*)\n?/gm, (match, indent, content) => {
				if (indent) {
					if (!firstIndent) {
						firstIndent = indent;
					}
					currentSublist += match;
				}
				else {
					let parsedSublist = '';
					if (currentSublist) {
						parsedSublist = parse(outdent(currentSublist, firstIndent));
					}
					if (firstItemCreated) {
						chunk += parsedSublist + '</li><li>';
					}
					chunk += parse(content);
					firstItemCreated = true;
					
					firstIndent = currentSublist = '';
				}
			});
			chunk += '</li></'+t+'>';
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
			t = 'h' + (token[14] ? token[14].length : (token[13]>'=' ? 1 : 2));
			chunk = '<'+t+'>' + parse(token[12] || token[15], links) + '</'+t+'>';
		}
		// `code`:
		else if (token[16]) {
			chunk = '<code>'+encodeAttr(token[16])+'</code>';
		}
		// Inline formatting: *em*, **strong** & friends
		else if (token[17] || token[1]) {
			chunk = tag(token[17] || '--');
		}
		// > Quotes
		else if (token[18]) {
			inner = parse(outdent(token[18].replace(/^\s*>/gm, '')));
			chunk = '<blockquote>' + inner + '</blockquote>';
		}
		out += prev;
		out += chunk;
	}

	return (out + md.substring(last) + flush()).replace(/^\n+|\n+$/g, '');
}
