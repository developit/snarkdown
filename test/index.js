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

		it('parses titles with reference links', () => {
			expect(
				snarkdown('# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/snarkdown')
			).to.equal('<h1>I like <a href="https://github.com/developit/snarkdown">tiny libraries</a></h1>');
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

		it('parses reference links without creating excessive linebreaks', () => {
			expect(snarkdown('\nhello [World]!\n\n[world]: http://world.com')).to.equal('hello <a href="http://world.com">World</a>!');
		});
	});

	describe('lists', () => {
		it('parses an unordered list with *', () => {
			expect(snarkdown('* One\n* Two')).to.equal('<ul><li>One</li><li>Two</li></ul>');
		});

		it('parses an unordered list with -', () => {
			expect(snarkdown('- One\n- Two')).to.equal('<ul><li>One</li><li>Two</li></ul>');
		});

		it('parses an unordered list with +', () => {
			expect(snarkdown('+ One\n+ Two')).to.equal('<ul><li>One</li><li>Two</li></ul>');
		});

		it('parses an unordered list with mixed bullet point styles', () => {
			expect(snarkdown('+ One\n* Two\n- Three')).to.equal('<ul><li>One</li><li>Two</li><li>Three</li></ul>');
		});

		it('parses an ordered list', () => {
			expect(snarkdown('1. Ordered\n2. Lists\n4. Numbers are ignored')).to.equal('<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>');
		});
	});

	describe('line breaks', () => {
		it('parses two new lines as line breaks', () => {
			expect(snarkdown('Something with\n\na line break')).to.equal('Something with<br />a line break');
		});

		it('parses two spaces as a line break', () => {
			expect(snarkdown('Something with  \na line break')).to.equal('Something with<br />a line break');
		});
	});

	describe('code & quotes', () => {
		it('parses inline code', () => {
			expect(snarkdown('Here is some code `var a = 1`.')).to.equal('Here is some code <code>var a = 1</code>.');
		});

		it('escapes inline code', () => {
			expect(snarkdown('a `<">` b')).to.equal('a <code>&lt;&quot;&gt;</code> b');
		});

		it('parses three backtricks (```) as a code block', () => {
			expect(snarkdown('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>');

			expect(snarkdown('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code js"><code class="language-js">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>');
		});

		it('parses tabs as a code poetry block', () => {
			expect(snarkdown('\tvar a = 1')).to.equal('<pre class="code poetry"><code>var a = 1</code></pre>');
		});

		it('escapes code/quote blocks', () => {
			expect(snarkdown('```\n<foo>\n```')).to.equal('<pre class="code "><code>&lt;foo&gt;</code></pre>');
			expect(snarkdown('\t<foo>')).to.equal('<pre class="code poetry"><code>&lt;foo&gt;</code></pre>');
		});

		it('parses a block quote', () => {
			expect(snarkdown('> To be or not to be')).to.equal('<blockquote>To be or not to be</blockquote>');
		});

		it('parses lists within block quotes', () => {
			expect(snarkdown('> - one\n> - two\n> - **three**\nhello')).to.equal('<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote>\nhello');
		});
	});

	describe('horizontal rules', () => {
		it('should parse ---', () => {
			expect(snarkdown('foo\n\n---\nbar')).to.equal('foo<hr />bar');
			expect(snarkdown('foo\n\n----\nbar'), '----').to.equal('foo<hr />bar');
			expect(snarkdown('> foo\n\n---\nbar')).to.equal('<blockquote>foo</blockquote><hr />bar');
		});

		it('should parse * * *', () => {
			expect(snarkdown('foo\n* * *\nbar')).to.equal('foo<hr />bar');
			expect(snarkdown('foo\n* * * *\nbar'), '* * * *').to.equal('foo<hr />bar');
			expect(snarkdown('> foo\n\n* * *\nbar')).to.equal('<blockquote>foo</blockquote><hr />bar');
		});
	});

	describe('html', () => {
		it('should not parse inside tags', () => {
			expect(snarkdown('<div title="I **don\'t** parse"></div>')).to.equal('<div title="I **don\'t** parse"></div>');
			expect(snarkdown('<a class="_b" target="_blank">a</a>')).to.equal('<a class="_b" target="_blank">a</a>');
		});
	});

	describe('edge cases', () => {
		it('should close unclosed tags', () => {
			expect(snarkdown('*foo')).to.equal('<em>foo</em>');
			expect(snarkdown('foo**')).to.equal('foo<strong></strong>');
			expect(snarkdown('[some **bold text](#winning)')).to.equal('<a href="#winning">some <strong>bold text</strong></a>');
			expect(snarkdown('`foo')).to.equal('`foo');
		});

		it('should not choke on single characters', () => {
			expect(snarkdown('*')).to.equal('<em></em>');
			expect(snarkdown('_')).to.equal('<em></em>');
			expect(snarkdown('**')).to.equal('<strong></strong>');
			expect(snarkdown('>')).to.equal('>');
			expect(snarkdown('`')).to.equal('`');
		});
	});
});
