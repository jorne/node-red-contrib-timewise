var should = require('should');
var timewiseNode = require('../timewise/timewise.js');
var helper = require('../node_modules/node-red/test/nodes/helper.js');
var now = new Date();

describe('Timewise Node', function() {

  before(function(done) {
    helper.startServer(done);
  });

  afterEach(function() {
    helper.unload();
    helper.stopServer();
  });

  it('should be loaded', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode' }];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      timewiseNode1.should.have.property('name', 'timewiseNode');
      done();
    });
  });

  it('should send a message to output 1 if the time has passed', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[['h1'], []], days:'1,2,3,4,5,6,0', time:'00:00'}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done();
      });

      timewiseNode1.receive();
    });

  });

  it('should not send a message to output 2 if the time has passed', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[[], ['h1']], days:'1,2,3,4,5,6,0', time:'00:00'}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done(Error('Should not get an input'));
      });

      timewiseNode1.receive();

      setTimeout(function() {
        done();
      }, 200);
    });

  });

  it('should send a message to output 2 if the time has not yet passed', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[[], ['h1']], days:'1,2,3,4,5,6,0', time:'23:59'}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done();
      });

      timewiseNode1.receive();
    });

  });

  it('should not send a message to output 1 if the time has not yet passed', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[['h1'], []], days:'1,2,3,4,5,6,0', time:'23:59'}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done(Error('We should never get an input!'));
      });

      timewiseNode1.receive();

      setTimeout(function() {
        done();
      }, 200);
    });

  });

  it('should send a message to output 1 if today is checked', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[['h1'], []], days:'1,2,3,4,5,6,0'}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done();
      });

      timewiseNode1.receive();
    });

  });

  it('should not send a message to output 2 if today is checked', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[[], ['h1']], days:'1,2,3,4,5,6,0'}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done(Error('Should not get an input'));
      });

      timewiseNode1.receive();

      setTimeout(function() {
        done();
      }, 200);
    });

  });

  it('should send a message to output 2 if today is unchecked', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[[], ['h1']], days:''}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done();
      });

      timewiseNode1.receive();
    });

  });

  it('should not send a message to output 1 if today is unchecked', function(done) {
    var flow = [{id:'n1', type:'timewise', name:'timewiseNode', wires:[['h1'], []], days:''}, {id:'h1', type:'helper', wires:[]}];
    helper.load(timewiseNode, flow, function() {
      var timewiseNode1 = helper.getNode('n1');
      var helperNode1 = helper.getNode('h1');

      helperNode1.on('input', function(msg) {
        done(Error('We should never get an input!'));
      });

      timewiseNode1.receive();

      setTimeout(function() {
        done();
      }, 200);
    });

  });
});
