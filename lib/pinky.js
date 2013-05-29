// Setup Pinky.js
var Promise = function() {
  var promise = this;
};

Promise.prototype = {
  constructor: Promise,
  
  then: function(onFulfilled, onRejected) {

  },

}

Pinky = {
  Promise: Promise
}

