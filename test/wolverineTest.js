'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var expect = chai.expect;
var Wolverine = require('../lib/wolverine');

var infoLog = new Wolverine(Wolverine.INFO, {time: false});
var warnLog = new Wolverine(Wolverine.WARN, {time: false});
var offLog = new Wolverine(Wolverine.OFF, {time: false});

describe('WolverineJS module', function() {
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

});
