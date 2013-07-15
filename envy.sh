#!/bin/bash
echo $1
if [ "$1" == "stop" ]; then
	forever stopall
	echo "Evny stopped!"
	mongo admin --eval "db.shutdownServer()"
else
	/usr/local/opt/mongodb/mongod run --config /usr/local/etc/mongod.conf	
	cd /Volumes/Envy/envy/APIv2/
	forever start -a -l envy.log -w bootstrap.js
	#tail -f ~/.forever/envy.log
	echo "Starting"
	sleep 5
	raw="$(curl http://localhost:61300)"
	echo $raw
fi
