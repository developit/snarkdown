Snarkdown [![NPM Version](http://img.shields.io/npm/v/snarkdown.svg?style=flat)](https://www.npmjs.org/package/snarkdown) [![Bower Version](http://img.shields.io/bower/v/snarkdown.svg?style=flat)](http://bower.io/search/?q=snarkdown)
============

[![Join the chat at https://gitter.im/developit/snarkdown](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/developit/snarkdown?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Snarkdown is a simple [Markdown](http://daringfireball.net/projects/markdown/) parser.  
It is [fast](http://jsperf.com/snarkdown-vs-everyone-else/2), and extremely small _(**975 bytes** gzipped)_.

Demo
----

Here's a simple JSFiddle demo of the parser:  
**[Snarkdown Demo](http://jsfiddle.net/developit/64rwu2dn/embedded/result,js,html,css/)**


About
-----

License: **MIT**  
Version: **0.5.0**  
Date:    **2014-11-04**  


Usage
-----

Adjust to suit your preferred module format.

```js
var md = require('snarkdown');

var html = md.parse('*this* is __easy__ to `use`.');
console.log(html);
```
