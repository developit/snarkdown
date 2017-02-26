# Snarkdown

[![npm](http://img.shields.io/npm/v/snarkdown.svg)](https://npmjs.com/snarkdown) [![travis](https://travis-ci.org/developit/snarkdown.svg?branch=master)](https://travis-ci.org/developit/snarkdown)

Snarkdown is a dead simple **1kb** [Markdown] parser.

It's designed to be as minimal as possible, for constrained use-cases where a full Markdown parser would be inappropriate.


## Features

- **Fast:** since it's basically one regex and a huge if statement
- **Tiny:** it's 1kb bytes of gzipped ES3
- **Simple:** pass a Markdown string, get back an HTML string

> **Notes:** Tables are not yet supported. If you love impossible to read regular expressions, submit a PR!


## Usage

Snarkdown exports a single function. It's available in [every module format](https://unpkg.com/snarkdown/dist/) you'd ever need: es, cjs, and umd.

```js
import snarkdown from 'snarkdown';

let html = snarkdown('_this_ is **easy** to `use`.');
console.log(html);  // "<em>this</em> is <strong>easy</strong> to <code>use</code>."
```


## Demo

Here's a simple JSFiddle demo showing live markdown rendering and the generated HTML:

**[Snarkdown Demo](http://jsfiddle.net/developit/828w6t1x/)**


## License

MIT


[Markdown]: http://daringfireball.net/projects/markdown/
