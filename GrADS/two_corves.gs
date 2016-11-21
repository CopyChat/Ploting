inputf1='/Users/ctang/climate/GLOBALDATA/OBSDATA/NCEP-NCAR/rsds_CERES_NCEP.2001-2013.fldmean.year.mean.nc'

YLAB.1='CERES'
YLAB.2='NCEP'

OUTPUT='rsds_CERES_vs_NCEP_SWIO_yearmean'

Trange='1 13'

Yrange.1='220 234'
TITLE='SSR over the SWIO (W/m2)'

#=================================================== 
* reinit grads and turns off grid lines and grads labels
'reinit'
'set grid on 2 15' ;** gray
'set grads off'

say 'sdfopen 'inputf1''
'sdfopen 'inputf1''

* set graph area to full window but 1in margin all around
'set parea 1. 10. 1. 7.5'

* set time range and fix lat/lon
'set t 'Trange''
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
'set xlopts 4 1 0.15'
'd rsds'
*'d tloop(aave(cvlh*86400,lon=-70,lon=-50,lat=-15,lat=0))'

* draw first y label
'draw ylab 'YLAB.1''

**** Second graph ****
* no markers, solid line style, red color and thick line
'set cmark 0'; 'set cstyle 2'; 'set ccolor 2'; 'set cthick 6'

* IMPORTANT: must fix y-range and y-step otherwise grads will
*   try to use the same as the first plot!
'set vrange 'Yrange.1''
'set ylint 2'

* y axis is drawn white, thick and labels have size 0.20
'set ylopts 2 4 0.20'

* IMPORTANT: place second y-axis on the right
'set ylpos 0 r'
'd dswrf'

* IMPORTANT: can't use draw ylab for 2nd label
'set strsiz 0.2'
'set string 2 c 6 -90'
'draw string 10.9 4.25 'YLAB.2''

* Graph title
'draw title 'TITLE''

*end



*================ save
