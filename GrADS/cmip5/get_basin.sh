#!/bin/sh
# get the size of the basin dimension from a netcdf file
# 1st arg is the netcdf filename
# calls ncdump and a simple C program called 'wordof' 
att=`ncdump -h $1 | grep "basin ="`
val=`wordof 3 $att`
echo $val 
