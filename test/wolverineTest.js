'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var expect = chai.expect;
var Wolverine = require('../lib/wolverine');

var infoLog = new Wolverine(Wolverine.INFO, {time: false}),
    warnLog = new Wolverine(Wolverine.WARN, {time: false}),
    offLog = new Wolverine(Wolverine.OFF, {time: false}),
    stackLog = new Wolverine(Wolverine.ERROR, {time: false, printStack: true});

describe('WolverineJS module', function() {
  it('Wolverine.ALL level should log everything', function() {
    var allLog = new Wolverine(Wolverine.ALL, {time: false});
    expect(allLog.verbose('Message')).to.equal('[VERBOSE]\tMessage');
    expect(allLog.debug('Message')).to.equal('[DEBUG]\tMessage');
    expect(allLog.info('Message')).to.equal('[INFO]\tMessage');
    expect(allLog.warn('Message')).to.equal('[WARN]\tMessage');
    expect(allLog.error('Message')).to.equal('[ERROR]\tMessage');
    expect(allLog.fatal('Message')).to.equal('[FATAL]\tMessage');
  });

  it('Default level = ALL', function() {
    var defaultLog = new Wolverine({time: false});
    expect(defaultLog.info('Message')).to.equal('[INFO]\tMessage');
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
    expect(warnLog.info('Should not log it')).to.equal('');
  });

  it('Should log just when activated', function() {
    expect(offLog.info('Should not log it')).to.equal('');
    expect(offLog.setLevel(Wolverine.INFO).info('Should log it')).to.equal('[INFO]\tShould log it');
  });

  it('Should print error message from a \'throw new Error(message)\'', function() {
    try {
      throw new Error('Surprise!')
    }
    catch(e) {
      expect(infoLog.error(e)).to.equal('[ERROR]\tError: Surprise!');      
    }
  });

  it('Should print error stack from an Exception passing the pushStack flag on constructor', function() {
    try {
      throw new Error('Surprise!')
    }
    catch(e) {
      expect(stackLog.error(e)).to.equal('[ERROR]\t' + e.stack);      
    }
  });

  it('Should print error stack from an Exception passing the pushStack flag on constructor', function() {
    try {
      throw new Error('Surprise!')
    }
    catch(e) {
      expect(infoLog.error(e, {printStack: true})).to.equal('[ERROR]\t' + e.stack);      
    }
  });

  it('Should add new level correctly', function() {
    var newLevelLog = new Wolverine({time: false});
    newLevelLog.addLevel('oneLevel', {
      priority: Wolverine.INFO,
      color: 'black',
      bg: 'white',
      underline: true
    });

    expect(newLevelLog.oneLevel('to rule them all')).to.equal('[ONELEVEL]\tto rule them all');
  });

});
