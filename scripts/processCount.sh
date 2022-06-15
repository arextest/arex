#!/bin/bash
scriptsDir=$(dirname $BASH_SOURCE)
cat ${scriptsDir%%/}/"../node_modules/@ctrip/node-vampire-heapdump/.state.json" 