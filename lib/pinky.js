var async = require('async')

// Setup Pinky.js
var Promise = function(job) {
  var promise = this;

  promise.state = 'pending'

  promise.__onFulfillmentHandlers = []
  promise.__onRejectionHandlers = []

  var jobFunc = function(j) { return j() }

  if (typeof(job) == 'function') {
    async.nextTick(function() {
      try {
        promise.__value = jobFunc(job);

        promise.state = 'fulfilled';

        for (var onFulfilled in promise.__onFulfillmentHandlers) {
          promise.__onFulfillmentHandlers[onFulfilled](promise.__value);
        } 
      }
      catch(exception) {
        promise.__error = exception;
        promise.state = 'rejected';
        for (var onRejected in promise.__onRejectionHandlers) {
          promise.__onRejectionHandlers[onRejected](exception)
        }
      }

    });
  }
};

Promise.prototype = {
  constructor: Promise,

  then: function(onFulfilled, onRejected) {
    var promise = this;
    async.nextTick(function() { 
      return function(promise) {
        if (promise.state == 'pending') {
          if (typeof(onFulfilled) == 'function') {
            promise.__onFulfillmentHandlers.push(onFulfilled)
          }

          if (typeof(onRejected) == 'function') {
            promise.__onRejectionHandlers.push(onRejected)
          }
        }
        else if (promise.state == 'fulfilled') {
          if (typeof(onFulfilled) == 'function') {
            onFulfilled(promise.__value)
          }
        }
        else {
          if (typeof(onRejected) == 'function')
            onRejected(promise.__error);
        }
      }(promise);
    });

    return new Promise;
  },
}

Pinky = {
  Promise: Promise
}

