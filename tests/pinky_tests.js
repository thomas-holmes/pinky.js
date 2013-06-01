var assert = require('assert')
var Pinky = require('../lib/pinky')

adapter = {
  pending: function() {
    var source = new Pinky.PromiseSource();
    var promise = source.getPromise(); 
    
    return {
      promise: promise,
      fulfill: source.fulfill,
      reject: source.reject
    }
  }
}

describe('Pinky.js', function() {
  it('exists', function() {
    assert.equal(typeof(Pinky), 'object')
  });

  describe('Promises/A+ Tests', function() {
    require("promises-aplus-tests").mocha(adapter)
  });

  describe('PromiseSource', function() {
    it('provides a promise', function() {
      var s = new Pinky.PromiseSource;
      var p = s.getPromise();
      assert.equal(Object.getPrototypeOf(p), Pinky.Promise.prototype);
    });

    describe('fulfillment', function() {
      it('can fulfill a promise', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        p.then(function() {
          done();
        });
        s.fulfill(50);
      });

      it('can fulfill a promise with the correct value', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        p.then(function(value) {
          assert.equal(value, 50);
          done();
        });
        s.fulfill(50);
      });

      it('can fulfill promise if value requested after it is available', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        s.fulfill(50);
        p.then(function() {
          done();
        });
      });

      it('can call multiple onFulfilled callbacks in order', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        var called = false;
        p.then(function(value) {
          called = true;
        });
        p.then(function(value) {
          assert.equal(called, true);
          done();
        });
        s.fulfill(50);
      });
    });

    describe('rejection', function() {
      it('can reject a promise', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        p.then(null, function() {
          done();
        });
        s.reject(new Error('Failure!'));
      });

      it('can reject a promise with the correct error', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        p.then(null, function(error) {
          assert.equal(error.message, 'Failure!');
          done();
        });
        s.reject(new Error('Failure!'));
      });

      it('can reject promise if value is requested after it is available', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        s.reject(new Error('Failure!'));
        p.then(null, function() {
          done();
        });
      });

      it('can call multiple onRejected callbacks in order', function(done) {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        var called = false;
        p.then(null, function(value) {
          called = true;
        });
        p.then(null, function(value) {
          assert.equal(called, true);
          done();
        });
        s.reject(new Error('Failure!'));
      });
    });
  });
});
