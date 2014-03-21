'use strict';

var chai = require('chai'),
    Stream = require('stream');
chai.expect();
chai.should();

var expect = chai.expect;
var Wolverine = require('../lib/wolverine');

describe('Stream as output', function() {

  it('Should write correctly to the stream', function() {
    var firstIteration = true;
    var stream = new Stream();
    stream.writable = true;
    stream.write = function(data) {
      if(firstIteration) {
        firstIteration = false;
        expect(data).to.equal('[INFO]\tMessage');
      }
    };

    var defaultLog = new Wolverine(Wolverine.INFO, {time: false, output: stream});
    defaultLog.info('Message');

  });

});
