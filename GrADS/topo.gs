*===================================== for the RegCM output
* 1, RegCM Variable to be ploted
Plotvar.1='topo'

* 2, Varibale units to be ploted:
Unit.1='degC'

* 3, RegCM output tag:
RegCMtag.1='SRF'


* 5, obs cross factor:
Modelcrs.1='1'

* 6, obs plus factor:
Modelpls.1='0'

* 8, season:
season='winter'
season='summer'

*===================================== for the Plot
  min.1=0
  max.1=2400

  couleur.1='deepskyblue->green->brown->gray'
  couleur.2='maroon->white->darkgreen'
  couleur.3='deepskyblue->white->deeppink'
  couleur.4='blue->white->crimson'

  couleur.5='white->orange->red'
  couleur.6='white->darkgreen'
  couleur.7='white->violet->deeppink'
  couleur.8='white->deepskyblue->darkblue'

*=========================================== prepare for ploting 
* 1, month label:
if(season='summer')
    monthlab='MJJASO'
  else
    monthlab='NDJFMA'
endif

* 3, output file name:
output='bias.turning.'season''
output='swio_topo'

* 4, title of the plot
TITLE='"biases vs 'OBSproj' of 'Plotvar'"'

*=================================================== 


******************************** to plot
  'reinit'
  'set gxout shaded'
  'set grads off'

* set grid status <style <color>>
  'set grid on 3 1 2'
  'set mpdset hires'
*  'set hershey off'
  'set map 1 1 8'
  'set clopts -1 -1 0.13'
*  set strsiz hsiz <vsiz>
*  This command sets the string character size, 
*  where hsiz is the width of the characters, 
*  vsiz is the height of the characters, in virtual page inches. 
*  If vsiz is not specified, it will be set the the same value as hsiz.

  'set vpage 1 8.0 1 8'
*=================================================== 

****** open RegCM output CCM
DIR='/Users/ctang/climate/Modeling/MPI-test/output/pprcmdata/monthly'
fname='topo.nc'

*************** read Model data
  j=1
    say 'open 'DIR'/'fname'.ctl'
    'open 'DIR'/'fname'.ctl'
    'set dfile 1'
    'q file'
    'set lon 2.6 100'
    'set lat -38.5 -1'
    'define modvar=('Plotvar.j')*('Modelcrs.j')+('Modelpls.j')'
*=================================================== 
*============================ to plot 
*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
*   'sel xlopts color thckns size' for the axis
    'set strsiz 0.2 0.2'
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'min.j' 'max.j' -kind 'couleur.j''
  'd modvar'
*  'drawstr -p 12 -t 'monthlab' -xo -0.3'
*  'draw title 'OBSproj.j''

  'set level 12'
  'set font 0.01 small small arial'
*  'draw ylab 'season''
  'xcbar 1.5 7.0 1.6 1.8 -fw 0.1'
*  'cbarn 0.6 0 5.5 1.5'

************** END to plot 





*=================================================== 
    'set vpage off'
    'save 'output''

  'close 1'
*=================================================== 
    say 'open 'output'.eps'
    '! killapp Preview'
    '! open 'output'.eps'
