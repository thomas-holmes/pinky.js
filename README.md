Pinky.js
=========

Pinky.js is an implementation of the [Promises/A+](http://promises-aplus.github.io/promises-spec/) in JavaScript. It is fully compliant with the spec but is still pre-alpha quality code. Use it at your own risk.

Usage
=========

Pinky is an implementation of the Promises/A+ standard. It does so in way that emulates the .Net `Task` class.

    // The promise source is how you fulfill or reject a promise
    var promiseSource = new Pinky.PromiseSource();
    
    var promise = promiseSource.getPromise()
      // Do something asynchronously
    });
    
    promise.then(function(value) {
      // Do something interesting with your successful value
    },
    function(error) {
      // Do something with the error condition
    });

    promiseSource.fulfill(50);

License
=========

The MIT License (MIT)

Copyright © 2013 Thomas Holmes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
