#!/bin/sh
# get the calendar attribute value from a netcdf file
# 1st arg is the netcdf filename
# calls ncdump and a simple C program called 'wordof' 
att=`ncdump -h $1 | grep "time:calendar ="`
val=`wordof 3 $att`
echo $val 
