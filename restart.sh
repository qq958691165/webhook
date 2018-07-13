#!/bin/bash

nohup sleep 1 && node index.js &

if [ $# == 1 ]
then
    kill $1
fi
