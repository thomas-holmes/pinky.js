var async = require('async')

// Setup Pinky.js
var Promise = function(job) {
  var promise = this;

  var jobFunc = function(j) { j() }

  promise.state = 'pending'

  promise.__onFulfillmentHandlers = []

  if (typeof(job) == 'function') {
    async.nextTick(function() {
      promise.__value = jobFunc(job);

      promise.state = 'fulfilled'

      console.log(promise.__onFulfillmentHandlers);

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

      console.log(this.state)
      if (this.state == 'pending') {
        this.__onFulfillmentHandlers.push(onFulfilled)
      }
      else if (this.state == 'fulfilled') {
        onFulfilled(this.__value)
      }
      else {
        
      }
    }

    return new Promise;
  },
}

Pinky = {
  Promise: Promise
}

