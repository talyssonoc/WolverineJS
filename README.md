# WolverineJS

[![Build Status](https://travis-ci.org/talyssonoc/WolverineJS.svg?branch=master)](https://travis-ci.org/talyssonoc/WolverineJS)

Useful library for server-side logging

## Install WolverineJS

`npm install wolverine`

## Usage

Instantiate a new WolverineJS object

```js
var Wolverine = require('wolverine');

var logger = new Wolverine([Wolverine.<LEVEL>], [options]); //For levels and options check the sessions below
```

Log it!

```js
logger.<LEVEL>('Title', 'Hi, I\'m %s and I\'m awesome', 'WolverineJS');
```

## Instantiating and logging

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
logger.verbose('Message');
logger.info('Title', 'Message');
logger.warn('Title', 'Hi, I\'m %s and I\'m awesome', 'WolverineJS');
try {
    throw new Error('Surprise!');
}
catch(e) {
    logger.error(e);
    logger.error(e, {printStack: true});

}
```

Logging with 3 or more parameters will follow the [util.format](http://nodejs.org/api/util.html#util_util_format_format) signature

## Default levels

* `Wolverine.ALL` Logs everything
* `Wolverine.VERBOSE` Informal message
* `Wolverine.DEBUG` Messages to help debugging the app
* `Wolverine.INFO` Informational message
* `Wolverine.WARN` Warning condition
* `Wolverine.ERROR` An error ocurred
* `Wolverine.FATAL` System is unusable
* `Wolverine.OFF` Logs nothing

## Options

* `output` (default: Nothing)
    * If ommited, print to the terminal
    * `String` Path to a file where the logs will be writen
    * `Object` WolverineJS will call the method `write` of this object, with the message as parameter, so you can use it for Streams or plugins
* `printTime` Show time in the beginning of each line (default: true)
* `printStack` If an Error object is passed to be logged, print its error stack (default: false). This flag can also be passed when a log method is called
* `printLevel` If the level name must be printed before the message (default: true)
* `printFileInfo` If the file and line number must be logged (default: false)

## API

* `logger.<LEVEL>()` Check the session above
* `logger.setLevel(Wolverine.<LEVEL>)` Set the logger to the given logging level
* `logger.getLevel()` Returns the current logging level
* `logger.addLevel(level, [newLevelOptions])` Adds a new level to the logger (see below)

## Options to add a new level

* `priority` Priority to the new level. Must be a WolverineJS level or a number (default: Wolverine.ALL)
* `color` Foregroung color of the output. (default: white, see the colors below)
* `bg` Background color of the output (default: transparent, see the colors below)
* `underline` If the output must be underlined (default: false)
* `bold` If the output must be bold (default: false)

### Colors

* `red`
* `green`
* `yellow`
* `blue`
* `magenta`
* `cyan`
* `white`
* `gray`
* `black`