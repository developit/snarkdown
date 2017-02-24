var expect = require('chai').expect
var md = require('../snarkdown')

describe('snarkdown test suite', function() {
  it('parses bold', function() {
    expect(md.parse('I **like** tiny libraries')).to.be.eql('I <strong>like</strong> tiny libraries')
  })
})
