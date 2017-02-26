import { expect } from 'chai';
import snarkdown from '../src';

describe('snarkdown()', () => {
	describe('text formatting', () => {
		it('parses bold with **', () => {
			expect(snarkdown('I **like** tiny libraries')).to.equal('I <strong>like</strong> tiny libraries');
		});

		it('parses bold with __', () => {
			expect(snarkdown('I __like__ tiny libraries')).to.equal('I <strong>like</strong> tiny libraries');
		});

		it('parses italics with *', () => {
			expect(snarkdown('I *like* tiny libraries')).to.equal('I <em>like</em> tiny libraries');
		});

		it('parses italics with _', () => {
			expect(snarkdown('I _like_ tiny libraries')).to.equal('I <em>like</em> tiny libraries');
		});
	});

	describe('titles', () => {
		it('parses H1 titles', () => {
			expect(snarkdown('# I like tiny libraries')).to.equal('<h1>I like tiny libraries</h1>');
		});

		it('parses underlined H1 titles', () => {
			expect(snarkdown('I like tiny libraries\n===')).to.equal('<h1>I like tiny libraries</h1>');
		});

		it('parses H2 titles', () => {
			expect(snarkdown('## I like tiny libraries')).to.equal('<h2>I like tiny libraries</h2>');
		});

		it('parses H3 titles', () => {
			expect(snarkdown('### I like tiny libraries')).to.equal('<h3>I like tiny libraries</h3>');
		});
	});

	describe('links & images', () => {
		it('parses links', () => {
			expect(snarkdown('[Snarkdown](http://github.com/developit/snarkdown)')).to.equal('<a href="http://github.com/developit/snarkdown">Snarkdown</a>');
		});

		it('parses anchor links', () => {
			expect(snarkdown('[Example](#example)')).to.equal('<a href="#example">Example</a>');
		});

		it('parses images', () => {
			expect(snarkdown('![title](foo.png)')).to.equal('<img src="foo.png" alt="title">');
			expect(snarkdown('![](foo.png)')).to.equal('<img src="foo.png" alt="">');
		});

		it('parses images within links', () => {
			expect(snarkdown('[![](toc.png)](#toc)')).to.equal('<a href="#toc"><img src="toc.png" alt=""></a>');
			expect(snarkdown('[![a](a.png)](#a) [![b](b.png)](#b)')).to.equal('<a href="#a"><img src="a.png" alt="a"></a> <a href="#b"><img src="b.png" alt="b"></a>');
		});

		it('parses reference links', () => {
			expect(snarkdown('\nhello [World]!\n[world]: http://world.com')).to.equal('hello <a href="http://world.com">World</a>!');
		});
	});

	describe('lists', () => {
		it('parses an unordered list with *', () => {
			expect(snarkdown('* One\n* Two')).to.equal('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n</ul>');
		});

		it('parses an unordered list with -', () => {
			expect(snarkdown('- One\n- Two')).to.equal('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n</ul>');
		});

		it('parses an unordered list with +', () => {
			expect(snarkdown('+ One\n+ Two')).to.equal('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n</ul>');
		});

		it('parses an unordered list with mixed bullet point styles', () => {
			expect(snarkdown('+ One\n* Two\n- Three')).to.equal('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n\t<li>Three</li>\n</ul>');
		});

		it('parses an ordered list', () => {
			expect(snarkdown('1. Ordered\n2. Lists\n4. Numbers are ignored')).to.equal('<ol>\n\t<li>Ordered</li>\n\t<li>Lists</li>\n\t<li>Numbers are ignored</li>\n</ol>');
		});
	});

	describe('line breaks', () => {
		it('parses two new lines as line breaks', () => {
			expect(snarkdown('Something with\n\na line break')).to.equal('Something with<br />\n\na line break');
		});

		it('parses two spaces as a line break', () => {
			expect(snarkdown('Something with  \na line break')).to.equal('Something with<br />\n\na line break');
		});
	});

	describe('code & quotes', () => {
		it('parses inline code', () => {
			expect(snarkdown('Here is some code `var a = 1`.')).to.equal('Here is some code <code>var a = 1</code>.');
		});

		it('parses three backtricks (```) as a code block', () => {
			expect(snarkdown('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code ">function codeBlocks() {\n\treturn "Can be inserted";\n}</pre>');

			expect(snarkdown('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code js">function codeBlocks() {\n\treturn "Can be inserted";\n}</pre>');
		});

		it('parses tabs as a code poetry block', () => {
			expect(snarkdown('\tvar a = 1')).to.equal('<pre class="code poetry">var a = 1</pre>');
		});

		it('parses a block quote', () => {
			expect(snarkdown('> To be or not to be')).to.equal('<blockquote>\nTo be or not to be\n</blockquote>');
		});
	});
});
