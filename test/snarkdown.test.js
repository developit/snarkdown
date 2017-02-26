import {expect} from 'chai'
import md from '../src'

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

  it('parses tabs as a code poetry block', function () {
    expect(md.parse('\tvar a = 1')).to.be.eql('<pre class="code poetry">var a = 1</pre>')
  })

  it('parses three backtricks (```) as a code block', function () {
    expect(md.parse('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.be.eql('<pre class="code ">function codeBlocks() {\n\treturn "Can be inserted";\n}</pre>')
  })
})
