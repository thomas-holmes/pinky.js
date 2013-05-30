#!/bin/bash

mocha -t 100 --compilers coffee:coffee-script `dirname $0`/tests
