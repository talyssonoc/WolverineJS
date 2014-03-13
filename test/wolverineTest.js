'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var expect = chai.expect;
var Wolverine = require('../lib/wolverine');
var log = new Wolverine(Wolverine.INFO, {time: false});

describe('WolverineJS module', function() {
  it('Just the message', function() {
    expect(log.info('message')).to.equal('[INFO]\tmessage');
  });

  it('Message title and body', function() {
    expect(log.info('title', 'test')).to.equal('[INFO]\ttitle: test');
  });

  it('Message title and body using format', function() {
    expect(log.info('title', 'test %s', 'error', 'error2')).to.equal('[INFO]\ttitle: test error error2');
  });

});
