WolverineJS
===========

Useful library for server-side logging

Install WolverineJS
===================

`npm install wolverine`

Usage
=====

Instantiate a new WolverineJS object

```js
var Wolverine = require('wolverine');

var logger = new Wolverine([Wolverine.<LEVEL>], [options]); //For levels and options check the sessions below
```

Log it!

```js
logger.info('Title');
logger.warn('Title', 'Message');
logger.error('Title', 'Hi, I\'m %s and I\'m awesome', 'WolverineJS');
```

API
===

You can instantiate a WolverineJS object in four ways:
<br/><br/>
Default level (Wolverine.ALL) and options (show time and print to the terminal)
<br/>
```js
var logger = new Wolverine();
```
<br/>
Default options (show time and print to the terminal) and custom level. Level must be a WolverineJS level constant (see below)
<br/>
```js
var logger = new Wolverine(Wolverine.<LEVEL>);
```
<br/>
Default level (Wolverine.ALL) and custom options. Options must be an object
<br/>
```js
var logger = new Wolverine(options);
```
<br/>
Custom level and options
<br/>
```js
var logger = new Wolverine(Wolverine.<LEVEL>, options);
```
<br/>
Then just log with one of the levels:
```js
logger.debug('Message');
logger.info('Title', 'Message');
logger.warn('Title', 'Hi, I\'m %s and I\'m awesome', 'WolverineJS');
logger.error('Message');
logger.fatal('Message');
try {
    throw new Error('Surprise!');
}
catch(e) {
    logger.error(e);
}
try {
    throw new Error('Surprise!');
}
catch(e) {
    logger.error(e, {printStack: true});
}
```

Logging with 3 or more parameters will follow the [util.format](http://nodejs.org/api/util.html#util_util_format_format) signature

Levels
======

* `Wolverine.ALL` Logs everything
* `Wolverine.DEBUG` Messages to help debugging the app
* `Wolverine.INFO` Informational message
* `Wolverine.WARN` Warning condition
* `Wolverine.ERROR` An error ocurred
* `Wolverine.FATAL` System is unusable
* `Wolverine.OFF` Logs nothing

Options
=======

* `output` Nothing = print to terminal. String = Path to a log file where the output will be writen
* `time` Show time in the beginning of each line (default: true)
* `printStack` If an Error object is passed to be logged, print its error stack (default: false). This flag can also be passed when a log method is called