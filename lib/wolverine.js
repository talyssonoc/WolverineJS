var util = require('util'),
    ansi = require('ansi'),
    fs = require('fs');

var Wolverine = function Wolverine(level, options) {
  if((typeof level === 'undefined' && typeof options === 'undefined') || typeof level === 'object') {
    this.level = Wolverine.ALL;
    this.options = level || {};
  }
  else {
    this.level = level;
    this.options = options || {};
  }

  if(typeof this.options.output !== 'undefined') {
    var outputStream = this.options.output;
    
    if(typeof outputStream === 'string') {
      outputStream = fs.createWriteStream(this.options.output);
    }

    //If the output must be saved to a file
    this.cursor = ansi(outputStream);
  }
  else {
    //If should print it on the terminal
    this.cursor = ansi(process.stderr);
  }
};

/**
 * Create the log levels
 */
Wolverine.ALL = -Infinity;
Wolverine.VERBOSE = 0;
Wolverine.DEBUG = 1;
Wolverine.INFO =  2;
Wolverine.WARN =  3;
Wolverine.ERROR = 4;
Wolverine.FATAL = 5;
Wolverine.OFF = Infinity;

var getDate = function getDate() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? '0' : '') + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? '0' : '') + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? '0' : '') + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? '0' : '') + month;

    var day = date.getDate();
    day = (day < 10 ? '0' : '') + day;

    return year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;
}

var getMessage = function getMessage(wolverineObj, style, fnArguments, levelName, levelPriority) {
  var message = '',
      level = '',
      args = Array.prototype.slice.call(fnArguments),
      time;

  levelPriority = levelPriority || Wolverine[levelName] || Wolverine.ALL;

  //If the logged level is allowed
  if(wolverineObj.level <= levelPriority) {
    if(typeof wolverineObj.options.time === 'undefined' || wolverineObj.options.time) {
       time = '[' + getDate() + ']\t'
    }
    else {
      time = '';
    }

    if(typeof wolverineObj.options.printLevel === 'undefined' || wolverineObj.options.printLevel) {
      level = '[' + levelName + ']\t';
    }
    else {
      level = '';
    }

    //If the passed argument is an error and it should print the error stack
    if(args[0] instanceof Error
      && (
        wolverineObj.options.printStack //If error stack should be printed by default
        || (args.length > 1 && args[1].printStack)) //Or printStack flag was passed as parameter
      ) {
      args[0] = args[0].stack;
      args.length = 1;
    }

    if(args.length == 0) {
        message = '\n';
    }
    else if(args.length == 1) {
        message = time + level + args[0];
    }
    else if(args.length == 2) {
        message = time + level + args[0] + ': ' + args[1];
    }
    else {
        message = time + level + args[0] + ': ' + util.format.apply(this, args.slice(1));
    }

    //Outputs the message
    if(style.color) {
      wolverineObj.cursor.fg[style.color]();
    }
    if(style.bg) {
      wolverineObj.cursor.bg[style.bg]();
    }
    if(style.underline) {
      wolverineObj.cursor.underline();
    }
    if(style.bold) {
      wolverineObj.cursor.bold();
    }

    if(typeof wolverineObj.options.silent === 'undefined' || !wolverineObj.options.silent) {
      wolverineObj.cursor.write(message).reset().write('\n');
    }
  }

  return message;
};

Wolverine.prototype = {
  verbose: function verbose() {
    return getMessage(this, {}, arguments, 'VERBOSE');
  },
  debug: function debug() {
    return getMessage(this, {color: 'cyan'}, arguments, 'DEBUG');
  },
  info: function info() {
    return getMessage(this, {color: 'green'}, arguments, 'INFO');
  },
  warn: function warn() {
    return getMessage(this, {color: 'yellow'}, arguments, 'WARN');
  },
  error: function error() {
    return getMessage(this, {color: 'red', bg: 'yellow'}, arguments, 'ERROR');
  },
  fatal: function fatal() {
    return getMessage(this, {color: 'black', bg: 'red'}, arguments, 'FATAL');
  },
  setLevel: function setLevel(level) {
    this.level = level;
    return this;
  },
  getLevel: function getLevel() {
    return this.level;
  },
  addLevel: function addLevel(levelName, options) {
    this[levelName] = function() {
      return getMessage(this, options, arguments, levelName.toUpperCase(), options.priority);
    };
  }
};

module.exports = Wolverine;