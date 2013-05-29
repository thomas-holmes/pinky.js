var assert = require('assert')
var pinky = require('../lib/pinky')

describe('Pinky.js', function() {
  it('exists', function() {
    assert.equal(typeof(Pinky), 'object')
  });

  describe('Promises', function() {
    it('can make a promise', function() {
      var p = new Pinky.Promise;
      assert.equal(Object.getPrototypeOf(p), Pinky.Promise.prototype);
    });

    it('takes one parameter', function() {
      assert.equal(Pinky.Promise.length,  1);
    });

    it('executes task', function(done) {
      var p = new Pinky.Promise(function() {
        done();
      });
    });

    describe('Then', function() {
      it('takes two arguments', function() {
        var p = new Pinky.Promise;
        assert.equal(p.then.length, 2)
      });

      it('returns a promise', function() {
        var p = new Pinky.Promise;
        var p2 = p.then(function(value){});
        assert.equal(Object.getPrototypeOf(p2), Pinky.Promise.prototype);
      });

      it('calls onFulfilled function when complete', function(done) {
        var p = new Pinky.Promise(function() {
        });

        p.then(function(value) {
          done();
        });
      });

      it('should call multiple onFulfilled functions when complete', function(done) {
        var p = new Pinky.Promise(function() {
        });

        var called = false
        p.then(function(value) {
          called = true
        });

        p.then(function(value) {
          if (called)
            done();
        });
      });

      it('should call onFulfilled with promise value when complete', function(done) {
        var p = new Pinky.Promise(function() {
          return "test!";
        });

        p.then(function(value) {
          assert.equal(value, "test!")
          done()
        });
      });

    });

  });

});
