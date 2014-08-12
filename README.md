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
    * `Stream` Log messages will be writen to the stream
* `printTime` Show time in the beginning of each line (default: true)
* `printStack` If an Error object is passed to be logged, print its error stack (default: false). This flag can also be passed when a log method is called
* `printLevel` If the level name must be printed before the message (default: true)
* `printFileInfo` If the file and line number must be logged (default: false)
* `driver` If you want to write the output to an API or service, you can use a driver. See below.

### Driver

The `driver` option is an object with two attributes, `lib` and `config`.

The first one must be a class, that receives two parameters in the constructor: a WolverineJS logger, and the
`config` attribute you've passed in the `driver` option.

This class must have an instance method called `write`. This method receives two parameters,
the first is the log message in its "default" format (with the color codes, that you can remove using
the `wolverineObj.chalk.stripColor(message)` method from the WolverineJS instance that comes in
the first parameter of the constructor, and the second is an object with the information
in case you want to make your own format inside your driver.

This second parameter will have the following attributes:

* `title` The title of the message, if any
* `message` The message logged
* `level` The name of the level
* `date` The Date object of the time it was logged
* `file` The file the log came from
* `line` The line of the file the log came from
* `error` The error object if it was logged an Error

If you disabled one of this options (e.g. { printStack: false }), the attribute won't be on the object.

You can see an example of the implementation of a driver in the [wolverinejs-stream](https://github.com/talyssonoc/wolverinejs-stream/blob/master/index.js) package.

## API

* `logger.<levelName>()` Check the session `Instantiating and logging`
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