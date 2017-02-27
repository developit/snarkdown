var expect = require('chai').expect
var md = require('../snarkdown')

describe('snarkdown test suite', function () {
  it('parses bold with **', function () {
    expect(md.parse('I **like** tiny libraries')).to.be.eql('I <strong>like</strong> tiny libraries')
  })

  it('parses bold with __', function () {
    expect(md.parse('I __like__ tiny libraries')).to.be.eql('I <strong>like</strong> tiny libraries')
  })

  it('parses italics with *', function () {
    expect(md.parse('I *like* tiny libraries')).to.be.eql('I <em>like</em> tiny libraries')
  })

  it('parses italics with _', function () {
    expect(md.parse('I _like_ tiny libraries')).to.be.eql('I <em>like</em> tiny libraries')
  })

  it('parses H1 titles', function () {
    expect(md.parse('# I like tiny libraries')).to.be.eql('<h1>I like tiny libraries</h1>')
  })

  it('parses underlined H1 titles', function () {
    expect(md.parse('I like tiny libraries\n===')).to.be.eql('<h1>I like tiny libraries</h1>')
  })

  it('parses H2 titles', function () {
    expect(md.parse('## I like tiny libraries')).to.be.eql('<h2>I like tiny libraries</h2>')
  })

  it('parses H3 titles', function () {
    expect(md.parse('### I like tiny libraries')).to.be.eql('<h3>I like tiny libraries</h3>')
  })

  it('parses links', function () {
    expect(md.parse('[Snarkdown](http://github.com/developit/snarkdown)')).to.be.eql('<a href="http://github.com/developit/snarkdown">Snarkdown</a>')
  })

  it('parses internal links', function () {
    expect(md.parse('[Example](#example)')).to.be.eql('<a href="#example">Example</a>')
  })

  it('parses inline code', function () {
    expect(md.parse('Here is some code `var a = 1`.')).to.be.eql('Here is some code <code>var a = 1</code>.')
  })

  it('parses an unordered list with *', function () {
    expect(md.parse('* One\n* Two')).to.be.eql('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n</ul>')
  })

  it('parses an unordered list with -', function () {
    expect(md.parse('- One\n- Two')).to.be.eql('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n</ul>')
  })

  it('parses an unordered list with +', function () {
    expect(md.parse('+ One\n+ Two')).to.be.eql('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n</ul>')
  })

  it('parses an unordered list with mixed bullet point styles', function () {
    expect(md.parse('+ One\n* Two\n- Three')).to.be.eql('<ul>\n\t<li>One</li>\n\t<li>Two</li>\n\t<li>Three</li>\n</ul>')
  })

  it('parses an ordered list', function () {
    expect(md.parse('1. Ordered\n2. Lists\n4. Numbers are ignored')).to.be.eql('<ol>\n\t<li>Ordered</li>\n\t<li>Lists</li>\n\t<li>Numbers are ignored</li>\n</ol>')
  })

  it('parses a block quote', function () {
    expect(md.parse('> To be or not to be')).to.be.eql('<blockquote>\nTo be or not to be\n</blockquote>')
  })

  it('parses two new lines as line breaks', function () {
    expect(md.parse('Something with\n\na line break')).to.be.eql('Something with<br />\n\na line break')
  })

  it('parses two spaces as a line break', function () {
    expect(md.parse('Something with  \na line break')).to.be.eql('Something with<br />\n\na line break')
  })

  it('parses tabs and four or more spaces as a code poetry block', function () {
    expect(md.parse('\tvar a = 1')).to.be.eql('<pre class="code poetry">var a = 1</pre>')
    expect(md.parse('        outerspace      ')).to.be.eql('<pre class="code poetry">outerspace</pre>')
    expect(md.parse('        outerspace\n    outerouterspace')).to.be.eql('<pre class="code poetry">outerspace\nouterouterspace</pre>')
    expect(md.parse('        outerspacewithbreak\n\n    lbouterouterspace')).to.be.eql('<pre class="code poetry">outerspacewithbreak\n\nlbouterouterspace</pre>')
    expect(md.parse('   3 spaces      ')).to.be.eql('3 spaces')
    expect(md.parse('\n   3 spaces')).to.be.eql('3 spaces')
  })

  it('parses three backtricks (```) as a code block', function () {
    expect(md.parse('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.be.eql('<pre class="code ">function codeBlocks() {\n\treturn "Can be inserted";\n}</pre>')
  })
  it('parses a combination of examples', function () {
    expect(md.parse('Markdown Parser\n===============\n\n*[Snarkdown](http://github.com/developit/snarkdown)* is __easy__ to `use`.\n\n\n[Example Link](#example)\n\nTwo newlines creates a line break.\n\nOr, end a line with two spaces.  \nJust like that!\n\nCode & Poetry\n-------------\n\n    You can also indent\n    blocks to display\n    code or poetry.\n    \n    Indented code/poetry blocks  \n    can be hard-wrapped.\n\n*Or, wrap your code in three backticks:*\n\n```JavaScript\nfunction codeBlocks() {\n    return \'Can be inserted\';\n}\n```\n\n\n### Block Quotes\n\n> You can insert quotes by\n> preceeding each line with `>`.\n>\n> Blockquotes can also contain line  \n> breaks.\n\n\n## Lists\n\n- Unordered\n* Lists\n+ Of mixed type\n\n1. Ordered\n2. Lists\n4. Numbers are ignored\n'))
    .to.be.eql('<h1>Markdown Parser</h1>\n<em><a href=\"http://github.com/developit/snarkdown\">Snarkdown</a></em> is <strong>easy</strong> to <code>use</code>.<br />\n\n<a href=\"#example\">Example Link</a><br />\n\nTwo newlines creates a line break.<br />\n\nOr, end a line with two spaces.<br />\n\nJust like that!\n\n<h2>Code & Poetry</h2>\n\n<pre class=\"code poetry\">You can also indent\nblocks to display\ncode or poetry.\n\nIndented code/poetry blocks  \ncan be hard-wrapped.</pre>\n<em>Or, wrap your code in three backticks:</em><br />\n\n\n<pre class=\"code javascript\">function codeBlocks() {\n    return \'Can be inserted\';\n}</pre>\n\n\n<h3>Block Quotes</h3>\n\n<blockquote>\nYou can insert quotes by\npreceeding each line with <code>></code>.<br />\n\nBlockquotes can also contain line<br />\n\nbreaks.\n</blockquote>\n\n\n<h2>Lists</h2>\n\n<ul>\n <li>Unordered</li>\n <li>Lists</li>\n <li>Of mixed type</li>\n</ul>\n<br />\n\n\n<ol>\n <li>Ordered</li>\n <li>Lists</li>\n <li>Numbers are ignored</li>\n</ol>')
  })
})
