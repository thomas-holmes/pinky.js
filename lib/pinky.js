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

  //getState: function() { return this.__state; }

  then: function(onFulfilled, onRejected) {
      if (this.state == 'pending') {
        if (typeof(onFulfilled) == 'function') {
          this.__onFulfillmentHandlers.push(onFulfilled)
        }

        if (typeof(onRejected) == 'function') {
          this.__onRejectionHandlers.push(onRejected)
        }
      }
      else if (this.state == 'fulfilled') {
        if (typeof(onFulfilled) == 'function') {
          onFulfilled(this.__value)
        }
      }
      else {
        if (typeof(onRejected) == 'function')
          onRejected();
      }

    return new Promise;
  },
}

Pinky = {
  Promise: Promise
}

