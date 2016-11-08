** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* bias.Temp.summer.RRTM.gs
* 
* This script creates Modelvar's maps of correlations with nino_3.4 index
*
* Written by Chao.TANG Mar. 2016
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


***********************************************
***********************************************
********** obs data works not good
********** another code in the $cddo directory
***********************************************

*=================================================== 
* variables could be changed
*===================================== for the OBS


say ' =============== start working =================== '

GCM='HadGEM2-ES'

* 0, change the header


OBSproj.1='GHCN'
OBSproj.1='CRU'
OBSproj.1='ERA_Interim'
OBSproj.2='CMAP'
OBSproj.2='GPCP'
OBSproj.3='CERES'
OBSproj.4='MODIS'

* 2, obs project name for Temp, Precip, SWD, TCC:
if(OBSproj.1='ERA_Interim')
    OBSvar.1='t2m'
    OBScrs.1='1'
    OBSpls.1='-273.5'
endif
if(OBSproj.1='CRU')
    OBSvar.1='tmp'
    OBScrs.1='1'
    OBSpls.1='0'
endif
if(OBSproj.1='GHCN')
    OBSvar.1='air'
    OBScrs.1='1'
    OBSpls.1='-273.5'
endif


if(OBSproj.2='GPCP')
  OBSvar.2='precip'
  OBScrs.2='1'
  OBSpls.2='0'
endif

if(OBSproj.2='CMAP')
  OBSvar.2='precip'
  OBScrs.2='1'
  OBSpls.2='0'
endif

if(OBSproj.2='TRMM')
  OBSvar.2='hrf'
  OBScrs.2='1'
  OBSpls.2='0'
endif

if(OBSproj.3='CERES')
  OBSvar.3='rsds'
  OBSvar.3='sfc_sw_down_all'
  OBScrs.3='1'
  OBSpls.3='0'
endif

if(OBSproj.4='MODIS')
  OBSvar.4='clt'
  OBScrs.4='1'
  OBSpls.4='0'
endif
*=================================================== 

* 6, change the PATH of OBS file
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

  obsmin.1=-0.3
  obsmax.1=0.3
  obsmin.2=-0.3
  obsmax.2=0.3
  obsmin.3=-0.3
  obsmax.3=0.3
  obsmin.1=-0.3
  obsmax.4=0.3


  couleur.1='blue->white->red'
  couleur.2='maroon->white->darkgreen'
  couleur.3='deepskyblue->white->deeppink'
  couleur.4='blue->white->crimson'

  OBScouleur='blue->white->red'
*=========================================== prepare for ploting 
* 2, obs plot title: 
OBSt=''Plotvar'_'OBSproj.j' ('Unit')'

* 3, output file name:
output='correlation.RegCM+'GCM''

* 4, title of the plot
TITLE='"correlation with nino_3.4 of 'Plotvar'"'
*=================================================== 


******************************** to plot
  'reinit'
  'set gxout shaded'
  'set mpdset hires'
*  'set hershey off'
  'set map 1 1 8'
  'set clopts -1 -1 0.13'
*  set strsiz hsiz <vsiz>
*  'set strsiz 1 1.6'
*  This command sets the string character size, 
*  where hsiz is the width of the characters, 
*  vsiz is the height of the characters, in virtual page inches. 
*  If vsiz is not specified, it will be set the the same value as hsiz.

  'set vpage 1 8.0 1 8'
*=================================================== 
****** read the nino_3.4 index
*** cut to SWIO domain

    'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/ENSO/standardized_SST_Anomaly_199601-200512.nc'
    'set t 1 119'
    'define sst=tas'

    'close 1'

*=================================================== 
*** set parameter for data reading in the loop of variable J
ForcingDir='/Users/tang/climate/CMIP5/monthly'
RCMDir='/Users/tang/climate/Modeling/333/Had.G71E0001/output/pprcmdata/monthly'

Forcing.1='Had_hist'


****** open RegCM output CCM
*** sumer 2001-2005
*=================================================== 
** model
k=1; kmax=1  
*================================================== 
** variable
j=1; jmax=2
n=jmax*k+1
totalp=3*jmax
  say 'totalplot='totalp''

*=================================================== 
*=================================================== 
n=1
while(j<=jmax)
****** BEGIN read the OBS data 
    if(OBSproj.j='ERA_Interim')
      if(OBSvar.j='t2m')
        'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/ERA_Interim/ERA.t2m.mon.mean.1996-2005.nc'
      endif
    endif

    if(OBSproj.j='GHCN')
      'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/GHCN/GHCN.air.timmean.2001-2005.nc'
    endif

    if(OBSproj.j='GPCP')
      'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/GPCP/precip.mon.mean.1996-2005.nc'
    endif


    if(OBSproj.j='CMAP')
      'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/CMAP/CMAP.precip.timmean.2001-2005.nc'
    endif

    if(OBSproj.j='CERES')
      'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/CERES/rsds_CERES-EBAF_L3B_Ed2-8_200003-201405.nc'
    endif

    if(OBSproj.j='TRMM')
      'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/TRMM/TRMM.hrf.timmean.mean.2001-2005.'monthlab'.nc'
    endif
    if(OBSproj.j='CRU')
      'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/CRU/3.20/cru_ts3.22.timmean.1996-2005.tmp.dat.nc'
    endif
    if(OBSproj.j='MODIS')
      'sdfopen /Users/tang/climate/GLOBALDATA/OBSDATA/MODIS/clt_MODIS_L3_C5_200101-200512.nc'
    endif

    'set t 1 119'

    'define obsvar=('OBSvar.j')*('OBScrs.j')+('OBSpls.j')'
    'set gxout shaded'
    'define corobs=tcorr(sst,obsvar,t=1,t=119)'
    'close 1'
****************** Attention *****************
****** END read the OBS data 


*=================================================== 
*************** read Forcing Model data

    'sdfopen 'ForcingDir'/'Forcevar.j'/hist/'GCM'/'Forcevar.j'_Amon_'GCM'_historical_r1i1p1_199601-200512.nc'
    'set dfile 1'

    'set lon 3 107'
    'set lat -37 -3'
    'set t 1 119'

    'define forcevar=('Forcevar.j')*('Forcecrs.j')+('Forcepls.j')'
    
    'define corfor=tcorr(sst,forcevar,t=1,t=119)'

    'close 1'
*=================================================== read RegCM data:
*=================================================== read RegCM data:

    'open 'RCMDir'/Had_hist.'RegCMtag.j'.mon.mean.1996-2005.nc.ctl'
    say 'open 'RCMDir'/Had_hist.'RegCMtag.j'.mon.mean.1996-2005.nc.ctl'
    'set dfile 1'

    'set lon 3 107'
    'set lat -37 -3'
    'set t 1 119'

    'define modvar=('Modelvar.j')*('Modelcrs.j')+('Modelpls.j')'
    'define corrcm=tcorr(sst,modvar,t=1,t=119)'

*============================ to plot OBS ( have to start from 1 )
*============================ to plot OBS ( have to start from 1 )
*============================ to plot OBS ( have to start from 1 )
*============================ to plot OBS ( have to start from 1 )
* plot num of obs
  pnobs=(j-1)*3+1
  say 'plot num of obs='pnobs''
    'set t 1'
*--------------------------------------------------- 
    'subplot 'totalp' 'pnobs' 'jmax' '
*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
    'set font 0.1 small small arial'
*   'sel xlopts color thckns size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur''
* 'color -var biasmodvar -kind blue->white->red'

*--------------------------------------------------- 
  'set lon 3 107'
  'set lat -37 -3'
  
  'd corobs'
  'cbarn 0.6 0 5.5 1.5'
*  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
  'draw title correlation of 'OBSproj.j' and nino_3.4 index '

* ----------------------------- to draw mean bias
  'd aave(corobs,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
*  meanbias: C_format = "%.2f"
  say 'meanbias='meanbias
  'drawstr -p 12 -k 5 -z 0.25 -t 'meanbias' -xo -0.3 -yo -1.6 %g'
*============================ END to plot OBS
*============================ END to plot OBS
*============================ END to plot OBS
*  font thickness are controlled by cbarn.gs in /usr/local/grads-2.0.2/lib/scripts
*  by 'set string color <justification <thickness <rotation>>>'
*  'xcbar 0.6 0 5.5 1.5 -fw 0.15 -fh 0.18 -edge triangle -fs 2 -fo 1'

*============================ to plot forcing GCM data:
*============================ to plot forcing GCM data:
*============================ to plot forcing GCM data:
* num of forcing data map:
    m1=(j-1)*3+2
    say 'plot num of forcing data='m1''
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm1''
    'set t 1'
*--------------------------------------------------- 

*    'subplot 'totalp' 'm1' 'jmax' -tall 1 '
    'subplot 'totalp' 'm1' 'jmax' '
* 20=total NO. of plots; k= plot num.; 3 NO.of column

*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
    'set font 0.1 small small arial'
*   'sel xlopts color thckns size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur''
* 'color -var biasmodvar -kind blue->white->red'


  'set lon 3 107'
  'set lat -37 -3'
  
  'd corfor'
  'cbarn 0.6 0 5.5 1.5'
*  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
  'draw title correlation of 'Plotvar.j'_'GCM' and nino_3.4 index '


* ----------------------------- to draw mean bias
  'd aave(corfor,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
*  meanbias: C_format = "%.2f"
  say 'meanbias='meanbias
  'drawstr -p 12 -k 5 -z 0.25 -t 'meanbias' -xo -0.3 -yo -1.6 %g'
*============================ END to plot forcing model



*============================ to plot RegCM output

*--------------------------------------------------- 
* plot num 
    m2=(j-1)*3+3
    say 'plot num ='m2''
    'set t 1'
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm2''
*--------------------------------------------------- 

*    'subplot 'totalp' 'm2' 'jmax' -tall 1'
    'subplot 'totalp' 'm2' 'jmax' '
* 20=total NO. of plots; k= plot num.; 3 NO.of column

*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
    'set font 0.1 small small arial'
*   'sel xlopts color thckns size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur''
* 'color -var biasmodvar -kind blue->white->red'

  'set lon 3 107'
  'set lat -37 -3'
  

  'd corrcm'
  'cbarn 0.6 0 5.5 1.5'
*  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
  'draw title correlation of 'Plotvar.j'_RegCM and nino_3.4 index '


* ----------------------------- to draw mean bias
  'd aave(corrcm,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 5 -z 0.25 -t 'meanbias' -xo -0.3 -yo -1.6'
*============================ END to plot forcing model

  'close 1'
************** END to plot OBS
  j=j+1
endwhile

*=================================================== 
    'set vpage off'
    'save 'output''
*=================================================== 
    say 'open 'output'.eps'
    '! killapp Preview'
    '! open 'output'.eps'
