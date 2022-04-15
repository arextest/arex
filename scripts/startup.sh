#!/bin/bash

appid=100036492
appname=nodeapp-$appid


# 不同的环境因为机器配置不一样,使用不同的实例数
case "$env" in
  "FWS"|"FAT"|"LPT")
    instance=3
  ;;
  "UAT")
    instance=5
  ;;
  *)
    instance=10
;;
esac

pm2 delete all

if [ -d /opt/nodeapp ]; then
  # docker
  cd /opt/nodeapp
else
  # vm
  cd "$(dirname $BASH_SOURCE)/../current/"
fi


NODE_ENV=production pm2 start server.js \
  -i $instance \
  --name $appname \
  --merge-logs \
  --log-date-format "YYYY-MM-DD HH:mm:ss.SSS" \
  --log "/opt/logs/$appid/outerr.log" \
  --output "/opt/logs/$appid/out.log" \
  --error "/opt/logs/$appid/err.log"
exit 0

