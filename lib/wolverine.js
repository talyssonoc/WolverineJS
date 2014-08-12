var util = require('util'),
    chalk = require('chalk');

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

        if(typeof this.options.output === 'string') {
            outputStream = require('fs').createWriteStream(this.options.output);
        }

        this.options.driver = {
            lib: require('wolverinejs-stream'),
            config: outputStream
        };
    }
    else if(!this.options.driver) {
        var outputStream = process.stderr;
        this._write = function _write(message) {
            outputStream.write(message + '\n');
        };
    }

    //If user is using a driver, sets it
    if(this.options.driver) {
        var driver = new this.options.driver.lib(this, this.options.driver.config);
        this._write = function write(message, data) {
            driver.write(message, data)
        };
    }

    //It's here for retrocompatibility,
    //the flag was once called "time"
    if(typeof this.options.time !== 'undefined') {
        console.error('`time` option is deprecated, use `printTime` option instead');
        this.options.printTime = this.options.time;
        delete this.options.time;
    }
    if(typeof this.options.printTime === 'undefined') {
        this.options.printTime = true;
    }
    if(typeof this.options.printStack === 'undefined') {
        this.options.printStack = false;
    }
    if(typeof this.options.printLevel === 'undefined') {
        this.options.printLevel = true;
    }
    if(typeof this.options.printFileInfo === 'undefined') {
        this.options.printFileInfo = false;
    }

    var lvl;
    for(var _lvl_ in this._levels) {
        lvl = this._levels[_lvl_];

        this[_lvl_] = getLevelLogger(this, lvl, _lvl_.toUpperCase());
    }

};

/**
 * Create the log levels
 */
Wolverine.ALL = -Infinity;
Wolverine.VERBOSE = 10;
Wolverine.DEBUG = 20;
Wolverine.INFO =  30;
Wolverine.WARN =  40;
Wolverine.ERROR = 50;
Wolverine.FATAL = 60;
Wolverine.OFF = Infinity;

var getDate = function getDate(date) {
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
};

/**
 * Generates the logger for a level
 * @param  {Wolverine} wolverineObj  
 * @param  {Object} levelObj      The object with info about the level
 * @param  {String} levelName     The name of the level
 * @param  {Number} levelPriority Priority of the level
 * @return {Function}               The function that logs this level
 */
var getLevelLogger = function getLevelLogger(wolverineObj, levelObj, levelName, levelPriority) {
    //Hack to start the writer
    levelObj.writer = chalk['hidden'];
    levelObj.writer.reset();


    //Style the level writer
    if(levelObj.color) {
        levelObj.writer = levelObj.writer[levelObj.color];
    }
    if(levelObj.bg) {
        levelObj.writer = levelObj.writer['bg' + (levelObj.bg.charAt(0).toUpperCase() + levelObj.bg.slice(1))];
    }
    if(levelObj.underline) {
        levelObj.writer = levelObj.writer.underline;
    }
    if(levelObj.bold) {
        levelObj.writer = levelObj.writer.bold;
    }

    levelObj.levelPriority = levelPriority || Wolverine[levelName] || Wolverine.ALL;

    var levelOnMessage = '';

    if(wolverineObj.options.printLevel) {
        levelOnMessage = '[' + levelName.toUpperCase() + ']\t';
    }

    var levelLogger = function levelLogger() {
        var message = '',
            args = Array.prototype.slice.call(arguments),
            time = '',
            fileInfo = '',
            info = {
                level: levelName
            };

        //If the logged level is allowed
        if(wolverineObj.level <= levelObj.levelPriority) {
            if(wolverineObj.options.printTime) {
                var date = new Date();
                info.date = date;
                time = '[' + getDate(date) + ']\t'
            }

            if(wolverineObj.options.printFileInfo) {
                var error = new Error(),
                    line = error.stack.split('\n')[2].split(':'),
                    file = line[line.length - 3];

                file = file.split(/[\\\/]+/g);
                file = file[file.length - 1];
                line = line[line.length - 2];
                fileInfo = '[' + file + ':' + line + ']\t';
                info.file = file;
                info.line = line;
            }

            //If the passed argument is an error and it should print the error stack
            if(args[0] instanceof Error
                && (
                    wolverineObj.options.printStack //If error stack should be printed by default
                    || (args.length > 1 && args[1].printStack) //Or printStack flag was passed as parameter
                )
            ) {
                info.error = args[0];
                args[0] = args[0].stack;
                args.length = 1;
            }

            switch(args.length) {
                case 0:
                    message = '\n';
                    break;
                case 1:
                    message = time + fileInfo + levelOnMessage + args[0];
                    info.title = '';
                    info.message = args[0];
                    break;
                case 2:
                    info.title = args[0];
                    info.message = args[1];
                    message = time + fileInfo + levelOnMessage + args[0] + ': ' + args[1];
                    break;
                default:
                    var formatedMessage = util.format.apply(this, args.slice(1));
                    info.title = args[0];
                    info.message = formatedMessage;
                    message = time + fileInfo + levelOnMessage + args[0] + ': ' + formatedMessage;
            }

            if(typeof wolverineObj.options.silent === 'undefined' || !wolverineObj.options.silent) {
                this._write(levelObj.writer(message), info);
            }
        }

        return message;
    };

    return levelLogger;
};

Wolverine.prototype = {

    setLevel: function setLevel(level) {
        this.level = level;
        return this;
    },

    getLevel: function getLevel() {
        return this.level;
    },

    addLevel: function addLevel(levelName, options) {
        this._levels[levelName] = options;

        this[levelName] = getLevelLogger(this, this._levels[levelName], levelName, options.priority);
    },

    _levels: {
        verbose: {},
        debug: {color: 'cyan'},
        info: {color: 'green'},
        warn: {color: 'yellow'},
        error: {color: 'red', bg: 'yellow'},
        fatal: {color: 'black', bg: 'red'}
    },

    chalk: chalk
};

module.exports = Wolverine;