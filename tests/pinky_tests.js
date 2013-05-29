var assert = require("assert")
var pinky = require("../lib/pinky")
describe('Pinky.js', function() {
  it('exists', function() {
    assert.equal(typeof(Pinky), 'object')
  });

  describe('Promises', function() {
    it('can make a promise', function() {
      var p = new Pinky.Promise;
      assert.equal(Object.getPrototypeOf(p), Pinky.Promise.prototype);
    });

    it('take two arguments', function() {
      var p = new Pinky.Promise;
      assert.equal(p.then.length, 2)
    });
  });
});
