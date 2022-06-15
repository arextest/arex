#!/bin/bash
scriptsDir=$(dirname $BASH_SOURCE)
node ${scriptsDir%%/}/"../node_modules/@ctrip/node-vampire-heapdump/scripts/dumpApp.js" $*