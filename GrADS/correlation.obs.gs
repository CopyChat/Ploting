** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* bias.Temp.summer.RRTM.gs
* 
* This script creates Modelvar's maps of the differences 
* of RegCM4 minus OBS in season 
*
* Written by Chao.TANG Sep. 2014
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

*=================================================== 
* variables could be changed
*===================================== for the OBS
* 0, change the header


GCM='HadGEM2-ES'

*===================================== for the RegCM output
* 1, RegCM Variable to be ploted
Plotvar.1='TEMP'
Plotvar.2='Precip'
Plotvar.3='SWD'
Plotvar.4='TCC'
* 2, Varibale units to be ploted:
Unit.1='degC'
Unit.2='mm/day'
Unit.3='W/m2'
Unit.4='%'
* 3, RegCM output tag:
RegCMtag.1='SRF'
RegCMtag.2='SRF'
RegCMtag.3='SRF'
RegCMtag.4='RAD'
* 4, model ouput var name in RegCM:
Modelvar.1='s01tas'
Modelvar.2='pr'
Modelvar.3='rsds'
Modelvar.4='clt'
* 5, RegCM cross factor:
Modelcrs.1='1'
Modelcrs.2='86400'
Modelcrs.3='1'
Modelcrs.4='100'
* 6, RegCM plus factor:
Modelpls.1='-273.5'
Modelpls.2='0'
Modelpls.3='0'
Modelpls.4='1'


* 7, GCM ouput var name in RegCM:
Forcevar.1='tas'
Forcevar.2='pr'
Forcevar.3='rsds'
Forcevar.4='clt'
* 8, GCM cross factor:
Forcecrs.1='1'
Forcecrs.2='86400'
Forcecrs.3='1'
Forcecrs.4='1'
* 9, GCM plus factor:
Forcepls.1='-273.5'
Forcepls.2='0'
Forcepls.3='0'
Forcepls.4='1'


*===================================== for the Plot
  biasmin.1=-6
  biasmax.1=6
  biasmin.2=-5
  biasmax.2=5
  biasmin.3=-100
  biasmax.3=100
  biasmin.4=-100
  biasmax.4=100

  obsmin.1=0
  obsmax.1=30
  obsmin.2=0
  obsmax.2=10
  obsmin.3=80
  obsmax.3=280
  obsmin.4=0
  obsmax.4=100


  couleur.1='blue->white->red'
  couleur.2='maroon->white->darkgreen'
  couleur.3='deepskyblue->white->deeppink'
  couleur.4='blue->white->crimson'

  OBScouleur.1='white->orange->red'
  OBScouleur.2='white->darkgreen'
  OBScouleur.3='white->violet->deeppink'
  OBScouleur.4='white->deepskyblue->darkblue'
*=========================================== prepare for ploting 
* 2, obs plot title: 
OBSt=''Plotvar'_'OBSproj.j' ('Unit')'

* 3, output file name:
output='crrelation+'GCM''

*=================================================== 

Forcing.1='Had_hist'

******************************** to plot
  'reinit'
*  'set grads off'
*  'set mpdset hires'
*  'set hershey off'
*  'set lon 3 80'
*  'set lat -3 -37'

*=================================================== 

* read stadard anomaly

    'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/ENSO/standardized_SST_Anomaly_199601-200512.nc'
    'set t 1 120'
    'define sst=tas.1'
    'close 1'

*=================================================== 
****** open obs data
    'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/ERA_Interim/ERA.t2m.mon.mean.1996-2005.nc'
    'set t 1 120'
*    'set lon 3 107'
*    'set lat -37 -3'
    'define forcevar=t2m'
    'set gxout shaded'
    'define corr=tcorr(sst,forcevar,t=1,t=120)'

  'run colors.gs'
  'set lev 10'
  'color -0.3 0.3 -kind blue->white->red'

*=================================================== 
  'set t 1'
* there's no color bar without this line
*=================================================== 
  'd corr'
  'cbarn '
*  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
  'draw title t2m correlation vs nino_3.4 index'
  'draw ylab 10 year mean'


****** open RegCM output CCM



*=================================================== 
    'save 'output''
*=================================================== 
    say 'open 'output'.eps'
    '! killapp Preview'
    '! open 'output'.eps'
