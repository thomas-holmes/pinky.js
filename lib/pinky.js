var async = require('async')

// Setup Pinky.js
var Promise = function(job) {
  var promise = this;

  var jobFunc = function(j) { j() }

  if (typeof(job) == 'function') {
    async.nextTick(function() {
      jobFunc(job);
    });
  }
};

Promise.prototype = {
  constructor: Promise,
  
  then: function(onFulfilled, onRejected) {
    if( typeof(onFulfilled) == 'function')
      onFulfilled(this.__value);

    return new Promise;
  },

  //__complete: function(){}

}

Pinky = {
  Promise: Promise
}

