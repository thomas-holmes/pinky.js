(function() {
  var async = require('async')

  var PromiseSource = function() {
    var source = this;
    var promise = new InnerPromise;
    var outerPromise = new OuterPromise(promise)

    this.fulfill = function(valueOrPromise) {
      promise.fulfill(valueOrPromise);
    };

    this.reject = function(error) {
      promise.reject(error);
    };

    this.getPromise = function() {
      return outerPromise;
    };
  };

  PromiseSource.prototype = {
    constructor: PromiseSource,
  };


  // Inner Promise
  var InnerPromise = function() {
    this.value = undefined;
    this.state = 'pending';
  };

  InnerPromise.prototype = {
    constructor: InnerPromise,

    fulfill: function(valueOrPromise) {
      this.state = 'fulfilled';
      this.value = valueOrPromise;
      if (typeof(this.onFulfilledHandler) == 'function') {
        this.onFulfilledHandler(this.value);
      }
    },

    reject: function(error) {
      this.state = 'rejected';
      this.value = error;
      if (typeof(this.onRejectedHandler) == 'function') {
        this.onRejectedHandler(this.value);
      }
    },

    then: function(onFulfilled, onRejected) {
      this.onFulfilledHandler = onFulfilled;
      this.onRejectedHandler = onRejected;
    },

    getValue: function() {
      return this.value;
    },

    getState: function() {
      return this.state;
    }
  };

  // Outer Promise
  var OuterPromise = function(inner) {
    var promise = this;
    this.onFulfilledHandlers = [];
    this.onRejectedHandlers = [];

    inner.then(function(value) {
      for (var i in promise.onFulfilledHandlers) {
        promise.onFulfilledHandlers[i](value);
      }
    },
    function(error) {
      for (var i in promise.onRejectedHandlers) {
        promise.onRejectedHandlers[i](error);
      }
    });

    this.then = function(onFulfilled, onRejected) {
      onFulfillmentRequest(onFulfilled);
      onRejectionRequest(onRejected);
    };

    function onFulfillmentRequest(func) {
      if (typeof(func) != 'function')
        return;

      if (inner.getState() == 'pending') {
        promise.onFulfilledHandlers.push(func);
      }
      else if (inner.getState() == 'fulfilled') {
        func(inner.getValue())
      }
    };

    function onRejectionRequest(func) {
      if (typeof(func) != 'function')
        return;

      if (inner.getState() == 'pending') {
        promise.onRejectedHandlers.push(func);
      }
      else if (inner.getState() == 'rejected') {
        func(inner.getValue());
      }
    };
  };

  OuterPromise.prototype = {
    constructor: OuterPromise,
  };

  // Module interface
  var pinky = {
    Promise: OuterPromise,
    PromiseSource: PromiseSource,
  }

  module.exports = pinky

}());


