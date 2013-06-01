#!/bin/bash

mocha -t 250 --compilers coffee:coffee-script `dirname $0`/tests
