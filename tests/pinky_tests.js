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

      describe('onFulfilled', function() {
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
            assert.equal(called, true)
            done();
          });
        });

        it('should call onFulfilled with promise value when complete', function(done) {
          var p = new Pinky.Promise(function() {
            return 'test!';
          });

          p.then(function(value) {
            assert.equal(value, 'test!')
            done()
          });
        });
      });

      describe('onRejected', function() {
        it('calls onRejected function when promise is rejected', function(done) {
          var p = new Pinky.Promise(function() {
            throw new Error('Failure!');
          });

          p.then(null, function(error) {
            done();
          });
        });

        it('calls onRejected with the error', function(done) {
          var p = new Pinky.Promise(function() {
            throw new Error('Ouch!');
          });

          p.then(null, function(error) {
            assert.equal(error.message, 'Ouch!');
            done();
          });
        });

        it('calls multiple onRejected handlers, in order', function(done) {
          var p = new Pinky.Promise(function() {
            throw new Error('So much pain!');
          });

          var called = false;
          p.then(null, function(error) {
            called = true;
          });

          p.then(null, function(error) {
            assert(called, true)
            done();
          });
        });
      });

      it('should not call onRejected if onFulfilled is called', function(done) {
        var p = new Pinky.Promise(function() {
        });

        p.then(function(value) {
        },
        function(error) {
          throw new Error('onRejected should not be called')
        });

        p.then(function(value) {
          done();
        });
      });

      it('should not call onFulfilled if onRejected is called', function(done) {
        var p = new Pinky.Promise(function() {
          throw new Error('Failure!')
        });

        p.then(function(value) {
          throw new Error('onFulfilled should not be called')
        },
        function(error) {
        });

        p.then(null, function(value) {
          done();
        });
      });

      it('should return before raising callbacks', function(done) {
        var p = new Pinky.Promise(function() {
        });

        var p2 = p.then(function() {
          assert.equal(typeof(p2), 'object')
          done();
        });
      });

    });

  });

});
