var async = require('async')

// Setup Pinky.js
var Promise = function(job) {
  var promise = this;

  promise.state = 'pending'

  promise.__onFulfillmentHandlers = []

  var jobFunc = function(j) { return j() }

  if (typeof(job) == 'function') {
    async.nextTick(function() {
      promise.__value = jobFunc(job);

      promise.state = 'fulfilled'

      for (var onFulfilled in promise.__onFulfillmentHandlers) {
        promise.__onFulfillmentHandlers[onFulfilled](promise.__value);
      } 
    });
  }
};

Promise.prototype = {
  constructor: Promise,

  then: function(onFulfilled, onRejected) {
    if (typeof(onFulfilled) == 'function') {
      if (this.state == 'pending') {
        this.__onFulfillmentHandlers.push(onFulfilled)
      }
      else if (this.state == 'fulfilled') {
        onFulfilled(this.__value)
      }
      else {
      // Rejection case  
      }
    }

    return new Promise;
  },
}

Pinky = {
  Promise: Promise
}

