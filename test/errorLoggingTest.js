'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var expect = chai.expect;
var Wolverine = require('../lib/wolverine');

var infoLog = new Wolverine(Wolverine.INFO, {time: false});

describe('Tests logging an Error object', function() {

  it('Should print error message from a \'throw new Error(message)\'', function() {
    try {
      throw new Error('Surprise!')
    }
    catch(e) {
      expect(infoLog.error(e)).to.equal('[ERROR]\tError: Surprise!');      
    }
  });

  it('Should print error stack from an Exception passing the pushStack flag on constructor', function() {
    var stackLog = new Wolverine(Wolverine.ERROR, {time: false, printStack: true});
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

  it('Should not show the level name', function() {
    var noNameLog = new Wolverine({time: false, printLevel: false});
    expect(noNameLog.info('Just me, no level name!')).to.equal('Just me, no level name!');
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
