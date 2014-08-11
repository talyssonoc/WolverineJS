'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var expect = chai.expect;
var Wolverine = require('../lib/wolverine');

var infoLog = new Wolverine(Wolverine.INFO, {printTime: false, silent: true});

describe('Common tests', function() {
  it('Wolverine.ALL level should log everything', function() {
    var allLog = new Wolverine(Wolverine.ALL, {printTime: false, silent: true});
    expect(allLog.verbose('Message')).to.equal('[VERBOSE]\tMessage');
    expect(allLog.debug('Message')).to.equal('[DEBUG]\tMessage');
    expect(allLog.info('Message')).to.equal('[INFO]\tMessage');
    expect(allLog.warn('Message')).to.equal('[WARN]\tMessage');
    expect(allLog.error('Message')).to.equal('[ERROR]\tMessage');
    expect(allLog.fatal('Message')).to.equal('[FATAL]\tMessage');
  });

  it('Default level = ALL', function() {
    var defaultLog = new Wolverine({printTime: false, silent: true});
    expect(defaultLog.info('Message')).to.equal('[INFO]\tMessage');
  });

  it('Should log verbose messages if VERBOSE level is set', function () {
    var verboseLog = new Wolverine(Wolverine.VERBOSE, {printTime: false, silent: true});
    expect(verboseLog.verbose('Message')).to.equal('[VERBOSE]\tMessage');
  });

  it('Just the message', function() {
    expect(infoLog.info('Message')).to.equal('[INFO]\tMessage');
  });

  it('Message title and body', function() {
    expect(infoLog.info('Title', 'Message')).to.equal('[INFO]\tTitle: Message');
  });

  it('Message title and body using format', function() {
    expect(infoLog.info('Title', 'Join %s', 'this', 'with this')).to.equal('[INFO]\tTitle: Join this with this');
  });

  it('Should not print if the logged level is not allowed', function() {
    var warnLog = new Wolverine(Wolverine.WARN, {printTime: false, silent: true});
    expect(warnLog.info('Should not log it')).to.equal('');
  });

  it('Should log just when activated', function() {
    var offLog = new Wolverine(Wolverine.OFF, {printTime: false, silent: true});
    expect(offLog.info('Should not log it')).to.equal('');
    expect(offLog.setLevel(Wolverine.INFO).info('Should log it')).to.equal('[INFO]\tShould log it');
  });

  it('Should show the line', function() {
    var lineLog = new Wolverine({printTime: false, silent: true, printFileInfo: true});
    expect(lineLog.info('Message')).to.equal('[wolverineTest.js:58]\t[INFO]\tMessage');
  });

});
