#=================================================== 
inputf1='/Users/ctang/climate/GLOBALDATA/OBSDATA/NCEP-NCAR/dswrf.sfc.gauss.yearmean.fldmean.1948-2016.swio.nc'

inputf2='/Users/ctang/climate/GLOBALDATA/OBSDATA/NCEP-NCAR/rsds_CERES_NCEP.2001-2013.fldmean.year.mean.nc'

Var.1='dswrf'
Var.2='rsds'

YLAB.1='NCEP'
YLAB.2='CERES'

OUTPUT='rsds_NCEP_SWIO_yearmean'

Trange.1='1 69'
Trange.2='1 13'

Yrange.1='224 244'
TITLE='NECP/NCAR SSR over the SWIO (W/m2)'

#=================================================== 
* reinit grads and turns off grid lines and grads labels
'reinit'
'set grid on 2 15' ;** gray
'set grads off'

say 'sdfopen 'inputf1''
'sdfopen 'inputf1''

* set graph area to full window but 1in margin all around
'set parea 1. 10. 1. 5.5'

* set time range and fix lat/lon
'set t 'Trange.1''
'set x 1'
'set y 1'

**** First graph ****
* no markers, solid line style, white color and thick line
'set cmark 0'; 'set cstyle 1'; 'set ccolor 1'; 'set cthick 6'

* fix y-range and y-step so that grads does what we want
'set vrange 'Yrange.1''
'set ylint 2'

* y axis is drawn white, thick and labels have size 0.20
'set ylopts 1 6 0.20'

* x axis is drawn blue, thin and labels have size 0.15
'set xlopts 1 6 0.15'
'd 'Var.1''
*'d tloop(aave(cvlh*86400,lon=-70,lon=-50,lat=-15,lat=0))'

* draw first y label
'draw ylab 'YLAB.1''

* Graph title
'draw title 'TITLE''

*end

*================ save
'save 'OUTPUT''
say 'open 'OUTPUT'.eps'
'! killapp Preview'
'! open 'OUTPUT'.eps'
