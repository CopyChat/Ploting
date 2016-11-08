* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* stdmap.gs
* 
* This script creates Precipitation's maps for each seasons 
*
* Written by L.Mariotti, May 2011
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* set variables 

varName=varName90908
month=month90908
ifile='ifile90908'
factor='factor90908'

* to plot
  'c'
  'set gxout shaded'
  'set grads off'
  'set grid off'
  'set mpdset hires'
  'set map 1 1 8'
  'set xlopts 1 4 0.15'
  'set ylopts 1 4 0.15'
  'set clopts -1 -1 0.16'
  'open 'ifile''
  'set lon 0 100'
  'set lat -40 0.00'

  'define mean1='varName'(t='month')factor90908'
  'define lmax=amax('varName',g)factor90908'
  'define lmin=amin('varName',g)factor90908'

  'color -var mean1 -kind lime->white->red '
  'color -var mean1 -kind blue->white->red '
*  'set clevs colorlevels90908 '
*  'set ccols 22 24 26 30 31 32 33 34 35 '
*  'set ccols 4 11 5 13 3 10 7 12 8 2 '
  
  'd mean1'

  'draw title title90908, month= 'month''
  'run cbarn.gs'

  'enable print map.'varName'.'month'.gmf'
  'print'
  'disable print'
  '!gxeps -c -i map.'varName'.'month'.gmf -o map.'varName'.'month'.eps'
 
quit
