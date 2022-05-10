#!/bin/sh

ADDR=localhost:80
LOG=/usr/local/tomo-api/log_check.txt
SCRIPT=/usr/local/tomo-api/start.sh

curl http://$ADDR/check
SAIDA=$?

if [ $SAIDA != 0 ]; then
  echo "Reiniciando"
  ps -aux|fgrep node|awk '{print $2}' |xargs kill -9
  echo "Reiniciando a api em `date`" >> $LOG
  $SCRIPT &
  echo "Reiniciando a api com sucesso">> $LOG
fi

