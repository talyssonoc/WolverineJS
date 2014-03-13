var util = require('util'),
    ansi = require('ansi'),
    fs = require('fs');

var Wolverine = function Wolverine(level, options) {
  this.level = level;
  this.options = options || {};

  if(typeof this.options.output !== 'undefined') {
    //If the output must be saved to a file
    this.cursor = ansi(fs.createWriteStream(this.options.output));
  }
  else {
    //If should print it on the terminal
    this.cursor = ansi(process.stderr);
  }
};

/**
 * Create the log levels
 */
Wolverine.DEBUG = 0;
Wolverine.INFO =  1;
Wolverine.WARN =  2;
Wolverine.ERROR = 3;
Wolverine.FATAL = 4;

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

var getMessage = function getMessage(options, cursor, style, level, fnArguments) {
  var message,
      args = Array.prototype.slice.call(fnArguments),
      time;

  if(typeof options.time === 'undefined' || options.time) {
     time = '[' + getDate() + ']\t'
  }
  else {
    time = '';
  }

  if(args.length == 0) {
      message = '\n';
  }
  else if(args.length == 1) {
      message = time + '[' + level + ']\t' + args[0];
  }
  else if(args.length == 2) {
      message = time + '[' + level + ']\t' + args[0] + ': ' + args[1];
  }
  else {
      message = time + '[' + level + ']\t' + args[0] + ': ' + util.format.apply(this, args.slice(1));
  }

  //Outputs the message
  if(style.color) {
    cursor.fg[style.color]();
  }
  if(style.bg) {
    cursor.bg[style.bg]();
  }
  cursor.write(message).reset().write('\n');

  return message;
};

Wolverine.prototype = {
  debug: function() {
    return getMessage(this.options, this.cursor, {}, 'DEBUG', arguments);
  },
  info: function() {
    return getMessage(this.options, this.cursor, {color: 'green'}, 'INFO', arguments);
  },
  warn: function() {
    return getMessage(this.options, this.cursor, {color: 'yellow'}, 'WARN', arguments);
  },
  error: function() {
    return getMessage(this.options, this.cursor, {color: 'red', bg: 'yellow'}, 'ERROR', arguments);
  },
  fatal: function() {
    return getMessage(this.options, this.cursor, {color: 'black', bg: 'red'}, 'FATAL', arguments);
  }
};

module.exports = Wolverine;