* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* mapPre.gs
* 
* This script creates Precipitation's maps of the differences 
* of RegCM4 minus CRU in mm/day and in % for each seasons 
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
  'set clopts -1 -1 0.13'

  'open 'ifile''
  'define rcmmean='varName'(t='month')factor90908 '
  'close 1'

  'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/obs90908'
  'set lon 0 100'
  'set lat -40 0.00'
  'define crumean=obsvar90908(t='month')obsfactor90908'


* RegCM-OBS
  'define obscru=lterp(crumean,rcmmean)'
  'define diffcru=(rcmmean-obscru)'
  'define percentcru=(rcmmean-obscru)*100/(obscru+0.01)'
  'define percentcru=maskout(percentcru,abs(obscru)-1.0)'

  'run subpg l2 1'
  'run colors.gs'
  'set clevs -10  -5 -2  -1 -0.5 0.5  1  2  5 10'
  'set ccols  21  22  23  24  26  0  30 31 32 33 34 35 '
  'd diffcru'
  'set font 1 small small arial'

  'draw title  title90908'
  'run cbarn.gs'


  
  'run subpg l2 2'
  'run colors.gs'
  'set clevs -100 -75 -50 -25 -10 10 25 50 75 100'
  'set ccols   21  22  23  24  26  0 30 31 32 33 34 35 '
  'd percentcru'

  'draw title  title89897'
  'run cbarn.gs'

  'enable print bias.'varName'.'month'.gmf'
  'print'
  'disable print'
  '!gxeps -c -i bias.'varName'.'month'.gmf -o bias.'varName'.'month'.eps'
  'close 1'

quit



