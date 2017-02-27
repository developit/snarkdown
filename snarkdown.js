(function(root, factory) {
	if (typeof define==='function' && define.amd) {
		define([], factory);
	}
	else if (typeof exports==='object') {
		module.exports = factory();
	}
	else {
		root.snarkdown = factory();
	}
}(this, function() {
	var tags = {
			_ : ['<em>','</em>'],
			__ : ['<strong>','</strong>'],
			'\n\n' : ['<br />\n\n', false],
			'>' : ['<blockquote>','</blockquote>'],
			'*' : ['<ul>','</ul>'],
			'#' : ['<ol>','</ol>']
		},
		escaped = /[^\\](\\\\)*\\$/g;

	function tag(context, token) {
		var norm = token.replace(/\*/g,'_').replace(/^(  \n\n*|\n{2,})/g,'\n\n'),
			end = context[context.length-1]===token,
			desc = tags[norm];
		if (!desc) return token;
		if (desc[1]===false) return desc[0];
		context[end?'pop':'push'](token);
		return desc[ end ? 1 : 0 ];
	}

	function outdent(str, ch) {
		ch = (ch || '') + (str.match(/^(\t|  )+/m) || ['[\\t ]*'])[0];
		return str.replace(new RegExp('^'+ch,'gm'),'');
	}
	
	function parse(md) {
		var tokenizer = /(?:^```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t| {4,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:\[([^\]]+?)\]\(([^\)]+?)\)|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,3})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]))/gm,
			context = [],
			out = '',
			last = 0,
			chunk, prev, token, esc, reg, inner, t, i;

		tokenizer.lastIndex = 0;
		while ( (token=tokenizer.exec(md)) ) {
			prev = md.substring(last, token.index);
			last = tokenizer.lastIndex;
			chunk = token[0];
			escaped.lastIndex = 0;
			if (escaped.test(prev)) {
				// escaped
			}
			// Code blocks:
			else if (token[2]) {
				chunk = '\n<pre class="code '+String(token[1]).toLowerCase()+'">'+token[2]+'</pre>\n';
			}
			// Indent blocks:
			else if (token[3]) {
				chunk = '\n<pre class="code poetry">'+outdent(token[3].trim())+'</pre>\n';
			}
			// > Quotes, -* lists:
			else if (token[5]) {
				t = token[5];
				if (t.charAt(t.length-1)==='.') {
					t = '.';
					token[4] = token[4].replace(/^\d+/gm, '');
				}
				inner = parse(outdent(token[4], '[>*+-.]'));
				if (t!=='>') {
					t = t==='.' ? '#' : '*';
					inner = inner.replace(/^(.*)$/gm, '\t<li>$1</li>');
				}
				chunk = '\n'+tags[t][0]+'\n' + inner + '\n'+tags[t][1]+'\n';
			}
			// Links:
			else if (token[6]) {
				chunk = token[6].link(token[7].replace(/^javascript\:/g,''));
			}
			// Titles:
			else if (token[8] || token[10]) {
				t = 'h' + (token[10] ? token[10].length : (token[9][0]==='='?1:2));
				chunk = '\n\n<'+t+'>' + parse(token[8] || token[11]) + '</'+t+'>\n';
			}
			// `code`:
			else if (token[12]) {
				chunk = '<code>'+token[12]+'</code>';
			}
			// Inline formatting: *em*, **strong** & friends
			else if (token[13]) {
				chunk = tag(context, token[13]);
			}
			out += prev;
			out += chunk;
		}

		out += md.substring(last);
		for (i=context.length; i--; ) {
			out += tag(context, context[i]);
		}

		return out.trim;
	}

	parse.parse = parse;
	return parse;
}));
