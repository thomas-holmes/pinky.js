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
    describe('Promise', function() {
      it('is returned', function() {
        var s = new Pinky.PromiseSource;
        var p = s.getPromise();
        assert.equal(Object.getPrototypeOf(p), Pinky.Promise.prototype);
      });

      it('then returns before callback is called', function(done) {
        var s = new Pinky.PromiseSource();
        var p = s.getPromise();
        s.fulfill(50);
        var p2 = p.then(function() {
          assert.notEqual(typeof p2, 'undefined')
          done();
        });
      });

      it('then returns a promise', function() {
        var s = new Pinky.PromiseSource();
        var p = s.getPromise();
        s.fulfill(50);
        var p2 = p.then();
        assert.equal(Object.getPrototypeOf(p2), Pinky.Promise.prototype);
      });

      describe('onFulfilled', function() {
        describe('is a function', function() {

          it('that returns a value', function(done) {
            var s = new Pinky.PromiseSource();
            var p = s.getPromise();
            s.fulfill(50);
            var p2 = p.then(function(value) {
              return value + 5;
            });
            p2.then(function(value) {
              assert.equal(value, 55);
              done();
            });
          });

          it('that returns a promise', function(done) {
            var s = new Pinky.PromiseSource();
            var p = s.getPromise();
            var p2 = p.then(function(value) {
              var s2 = new Pinky.PromiseSource();
              s2.fulfill(80);
              return s2.getPromise()
            });

            p2.then(function(value) {
              assert.equal(value, 80);
              done();
            });

            s.fulfill(50);
          });

          it('that throws an error', function(done) {
            var s = new Pinky.PromiseSource();
            var p = s.getPromise();
            var p2 = p.then(function() {
              throw new Error('Failure!');
            });
            p2.then(null, function(error) {
              assert.equal(error.message, 'Failure!');
              done();
            });
            s.fulfill(50);
          });
        });

        it('is a value', function(done) {
          var s = new Pinky.PromiseSource();
          var p = s.getPromise();
          var p2 = p.then(17);
          p2.then(function(value) {
            assert.equal(value, 17);
            done();
          });
          s.fulfill(50);
        });
      });

      describe('onRejected', function() {
        describe('is a function', function() {
          it('that returns a value', function(done) {
            var s = new Pinky.PromiseSource();
            var p = s.getPromise();
            s.reject(new Error('Failure!'));
            var p2 = p.then(null, function(error) {
              return new Error('Double Failure!');
            });
            p2.then(function(value) {
              assert.equal(value.message, 'Double Failure!');
              done();
            });
          });

          it('that returns a promise', function(done) {
            var s = new Pinky.PromiseSource();
            var p = s.getPromise();
            var p2 = p.then(null, function(value) {
              var s2 = new Pinky.PromiseSource();
              s2.fulfill(80);
              return s2.getPromise()
            });

            p2.then(function(value) {
              assert.equal(value, 80);
              done();
            });

            s.reject(50);
          });

          it('that throws an error', function(done) {
            var s = new Pinky.PromiseSource();
            var p = s.getPromise();
            var p2 = p.then(null, function() {
              throw new Error('Failure 2!');
            });
            p2.then(null, function(error) {
              assert.equal(error.message, 'Failure 2!');
              done();
            });
            s.reject(new Error('Failure!'));
          });
        });

        it('is a value', function(done) {
          var s = new Pinky.PromiseSource();
          var p = s.getPromise();
          var p2 = p.then(null, 17);
          p2.then(null, function(value) {
            assert.equal(value, 17);
            done();
          });
          s.reject(50);
        });
      });
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

      it('can only fulfill once', function(done) {
        setTimeout(function() {
          assert.equal(50, val);
          done();
        }, 5);
        var s = new Pinky.PromiseSource();
        var p = s.getPromise();
        var val = undefined;
        p.then(function(value) {
          val = value;
        });
        s.fulfill(50);
        s.fulfill(55);
      });

      it('can not fulfill if already rejected', function(done) {
        setTimeout(function() {
          assert.equal(val, 50);
          done();
        }, 5);
        var s = new Pinky.PromiseSource();
        var p = s.getPromise();
        var val = undefined;
        p.then(function(value) {
          val = value;
        },
        function(error) {
          val = error;
        });
        s.reject(50);
        s.fulfill(55);
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

      it('can only reject once', function(done) {
        setTimeout(function() {
          assert.equal(val, 50);
          done();
        }, 5);
        var s = new Pinky.PromiseSource();
        var p = s.getPromise();
        var val = undefined;
        p.then(null, function(error) {
          val = error;
        });
        s.reject(50);
        s.reject(55);
      });

      it('can not reject if already fulfilled', function(done) {
        setTimeout(function() {
          assert.equal(val, 50);
          done();
        }, 5);
        var s = new Pinky.PromiseSource();
        var p = s.getPromise();
        var val = undefined;
        p.then(function(value) {
          val = value;
        },
        function(error) {
          val = error;
        });
        s.fulfill(50);
        s.reject(55);
      });
    });
  });
});
