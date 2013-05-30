#!/bin/bash

mocha --compilers coffee:coffee-script `dirname $0`/tests
