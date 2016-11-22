** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* performance.MPI-test.2001-2002.seasonal.gs
* 
* This script creates Modelvar's maps of the differences 
* of RegCM4 minus OBS in seasons 
*
* Written by Chao.TANG Sep. 2014
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

*=================================================== 
* variables could be changed
*===================================== OBS data
* 1, whether plot OBS
obs=1 

OBSDIR='/Users/ctang/climate/GLOBALDATA/OBSDATA'

OBSproj.1='GHCN'
OBSproj.1='CRU'
OBSproj.1='ERA_Interim'

OBSproj.2='CMAP'
OBSproj.2='GPCP'

OBSproj.3='CERES'
OBSproj.3='CM_SAF'

OBSproj.4='MODIS'
OBSproj.4='CM_SAF'

OBSproj.5='CERES'

OBSproj.6='ERA_Interim'
OBSproj.7='ERA_Interim'

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
  OBSvar.3='sfc_sw_down_all'
  OBScrs.3='1'
  OBSpls.3='0'
endif
if(OBSproj.3='CM_SAF')
  OBSvar.3='sis'
  OBScrs.3='1'
  OBSpls.3='0'
endif


if(OBSproj.4='MODIS')
  OBSvar.4='clt'
  OBScrs.4='1'
  OBSpls.4='0'
endif
if(OBSproj.4='CM_SAF')
  OBSvar.4='cfc'
  OBScrs.4='1'
  OBSpls.4='0'
endif

if(OBSproj.5='CERES')
    OBSvar.5='lwp_total_mon'
    OBScrs.5='1'
    OBSpls.5='1'
endif

if(OBSproj.6='ERA_Interim')
    OBSvar.6='t2m'
    OBScrs.6='1'
    OBSpls.6='-273.5'
endif
if(OBSproj.7='ERA_Interim')
    OBSvar.7='t2m'
    OBScrs.7='1'
    OBSpls.7='-273.5'
endif
#=============================== Forcing data
ForcingGCM='MPI-ESM-LR'

* ForcingGCM ouput var name in RegCM:
Forcevar.1='tas'
Forcevar.2='pr'
Forcevar.3='rsds'
Forcevar.4='clt'
Forcevar.5='tas'
Forcevar.6='tas'
Forcevar.7='tas'

* ForcingGCM cross factor:
Forcecrs.1='1'
Forcecrs.2='86400'
Forcecrs.3='1'
Forcecrs.4='1'
Forcecrs.5='1'
Forcecrs.6='1'
Forcecrs.7='1'

* ForcingGCM plus factor:
Forcepls.1='-273.5'
Forcepls.2='0'
Forcepls.3='0'
Forcepls.4='1'
Forcepls.5='-273.5'
Forcepls.6='-273.5'
Forcepls.7='-273.5'

*=============================== RegCM data
RCMtag='MPI_hist'
YEARtag='2001-2002'
RCMDIR='/Users/ctang/climate/Modeling/MPI-test/output_4/pprcmdata/monthly'

* RegCM Variable to be ploted
Plotvar.1='TEMP'
Plotvar.2='Precip'
Plotvar.3='SWD'
Plotvar.4='TCC'
Plotvar.5='LWP'
Plotvar.6='TEMP'
Plotvar.7='TEMP'

* Varibale units to be ploted:
Unit.1='degC'
Unit.2='mm/day'
Unit.3='W/m2'
Unit.4='%'
Unit.5='g m-2'
Unit.6='degC'
Unit.7='degC'

* RegCM output tag:
RegCMtag.1='SRF'
RegCMtag.2='SRF'
RegCMtag.3='SRF'
RegCMtag.4='RAD'
RegCMtag.5='RAD'
RegCMtag.6='SRF'
RegCMtag.7='SRF'

* model ouput var name in RegCM:
Modelvar.1='s01tas'
Modelvar.2='pr'
Modelvar.3='rsds'
Modelvar.4='clt'
Modelvar.5='clw'
Modelvar.6='s01tas'
Modelvar.7='s01tas'

* RegCM cross factor:
Modelcrs.1='1'
Modelcrs.2='86400'
Modelcrs.3='1'
Modelcrs.4='100'
Modelcrs.5='1'
Modelcrs.6='1'
Modelcrs.7='1'

* RegCM plus factor:
Modelpls.1='-273.5'
Modelpls.2='0'
Modelpls.3='0'
Modelpls.4='1'
Modelpls.5='0'
Modelpls.6='-273.5'
Modelpls.7='-273.5'

* chose the Radiation Scheme:
*Radiation='CCM'
*Radiation='RRTM'

* season:
season='winter'
season='summer'

if(season='summer')
    monthlab='NDJFMA'
  else
    monthlab='MJJASO'
endif

*===================================== colorbar
  biasmin.1=-6
  biasmax.1=6
  biasmin.2=-4
  biasmax.2=4
  biasmin.3=-100
  biasmax.3=100
  biasmin.4=-100
  biasmax.4=100
  biasmin.5=-6
  biasmax.5=6
  biasmin.6=-6
  biasmax.6=6
  biasmin.7=-6
  biasmax.7=6

  obsmin.1=0
  obsmax.1=30
  obsmin.2=0
  obsmax.2=8
  obsmin.3=80
  obsmax.3=320
  obsmin.4=0
  obsmax.4=100
  obsmin.5=10
  obsmax.5=80
  obsmin.6=0
  obsmax.6=30
  obsmin.7=0
  obsmax.7=30

  stdmin.1=0
  stdmax.1=1
  stdmin.2=0
  stdmax.2=4
  stdmin.3=0
  stdmax.3=30
  stdmin.4=0
  stdmax.4=50
  stdmin.5=0
  stdmax.5=10
  stdmin.6=0
  stdmax.6=1
  stdmin.7=0
  stdmax.7=1


  couleur.1='blue->white->red'
  couleur.2='maroon->white->darkgreen'
  couleur.3='deepskyblue->white->deeppink'
  couleur.4='blue->white->crimson'
  couleur.5='blue->white->red'
  couleur.6='blue->white->red'
  couleur.7='blue->white->red'

  OBScouleur.1='white->orange->red'
  OBScouleur.2='white->darkgreen'
  OBScouleur.3='white->violet->deeppink'
  OBScouleur.4='white->deepskyblue->darkblue'
  OBScouleur.5='white->orange->red'
  OBScouleur.6='white->orange->red'
  OBScouleur.7='white->orange->red'

#=================================================== title
* obs plot title: 
OBSt=''Plotvar'_'OBSproj.j' ('Unit')'

* title of the plot
TITLE='"biases vs 'OBSproj.j' of 'Plotvar'"'

#=================================================== output
* output file name:
output='performance.RegCM_'ForcingGCM'_'YEARtag'_'monthlab''

******************************** to plot setting
  'reinit'
  'set gxout shaded'
  'set grads off'
  'set grid off'
  'set mpdset hires'
*  'set hershey off'
  'set map 1 1 1'
* set map color <style <thickness>>
  'set clopts -1 -1 0.13' ;* contour labels drawn on contour lines.

  'set vpage 1 8 1 8'
*=================================================== 
** model
k=1; kmax=1  
*================================================== 
** variable

j=1; jmax=7

LINE=9
totalp=LINE*jmax
  say 'totalplot======================='totalp''
*=================================================== 
n=1
while(j<=jmax)
****** BEGIN read OBS data 
    if(OBSproj.j='ERA_Interim')
      if(OBSvar.j='t2m')
        'sdfopen 'OBSDIR'/ERA_Interim/ERA.t2m.ymon.mean.'YEARtag'.'monthlab'.nc'
        say 'sdfopen 'OBSDIR'/ERA_Interim/ERA.t2m.ymon.mean.'YEARtag'.'monthlab'.nc'
      else
        'sdfopen 'OBSDIR'/ERA_Interim/ERA.tp.ymon.mean.'YEARtag'.'monthlab'.nc'
      endif
    endif
    if(OBSproj.j='GPCP')
      say 'sdfopen 'OBSDIR'/GPCP/precip.ymon.mean.'YEARtag'.'monthlab'.nc'
      'sdfopen 'OBSDIR'/GPCP/precip.ymon.mean.'YEARtag'.'monthlab'.nc'
    endif
    if(OBSproj.j='CERES')
      if(OBSvar.j='sfc_sw_down_all')
        say 'sdfopen 'OBSDIR'/CERES/CERES_EBAF-Surface_Ed2.7_Subset.ymon.mean.'YEARtag'.'monthlab'.nc'
        'sdfopen 'OBSDIR'/CERES/CERES_EBAF-Surface_Ed2.7_Subset.ymon.mean.'YEARtag'.'monthlab'.nc'
      endif
      if(OBSvar.j='lwp_total_mon')
        say 'sdfopen 'OBSDIR'/CERES/CERES_SYN1deg-Month_Terra-Aqua-MODIS_Ed3A_Subset_'YEARtag'.ymon.mean.'monthlab'.nc'
        'sdfopen 'OBSDIR'/CERES/CERES_SYN1deg-Month_Terra-Aqua-MODIS_Ed3A_Subset_'YEARtag'.ymon.mean.'monthlab'.nc'
      endif
    endif
    if(OBSproj.j='TRMM')
      say 'sdfopen 'OBSDIR'/TRMM/TRMM.hrf.ymon.mean.'YEARtag'.'monthlab'.nc'
      'sdfopen 'OBSDIR'/TRMM/TRMM.hrf.ymon.mean.'YEARtag'.'monthlab'.nc'
    endif
    if(OBSproj.j='CM_SAF')
      if(OBSvar.j='cfc')
      say 'sdfopen 'OBSDIR'/CM_SAF/CFC/CFCmm.200001-200912.GL.2001-2002.ymon.mean.'monthlab'.nc'
      'sdfopen 'OBSDIR'/CM_SAF/CFC/CFCmm.200001-200912.GL.'YEARtag'.ymon.mean.'monthlab'.nc'
      endif
      if(OBSvar.j='sis')
      'sdfopen 'OBSDIR'/CM_SAF/SIS/SISmm.199901-200710.'YEARtag'.ymon.mean.'monthlab'.nc'
      say 'sdfopen 'OBSDIR'/CM_SAF/SIS/SISmm.199901-200710.'YEARtag'.ymon.mean.'monthlab'.nc'
      endif
    endif
    if(OBSproj.j='CRU')
      'sdfopen 'OBSDIR'/CRU/3.20/cru_ts3.20.tmp.ymon.mean.'YEARtag'.'monthlab'.nc'
      say 'sdfopen 'OBSDIR'/CRU/3.20/cru_ts3.20.tmp.ymon.mean.'YEARtag'.'monthlab'.nc'
    endif
    if(OBSproj.j='MODIS')
      say 'sdfopen 'OBSDIR'/MODIS/clt/clt_MODIS_L3_C5_200101-200212.ymon.mean.'monthlab'.nc'
      'sdfopen 'OBSDIR'/MODIS/clt/clt_MODIS_L3_C5_200101-200212.ymon.mean.'monthlab'.nc'
    endif

    'set dfile 1'
    'set lon 3 107'
    'set lat -37 -3'

    'q dims'
    xline=sublin(result,2)    ;* 2nd line
    yline=sublin(result,3)    ;* 3rd line

    xmax=subwrd(xline,13)    ;*13th word on xline
    ymax=subwrd(yline,13)    ;*13th word on yline

    say 'obs grid:'
    say 'X grid-points: 'xmax''
    say 'Y grid-points: 'ymax''

    'define obs=('OBSvar.j')*('OBScrs.j')+('OBSpls.j')'
    'define obsave=ave('OBSvar.j',t=1,t=6)*('OBScrs.j')+('OBSpls.j')'
    'define obsstd=sqrt(ave(pow(obs-obsave,2),t=1,t=6))'
*    'fprintf obsstd ./obsstd.txt'
    'close 1'
****************** Attention *****************
****** END read the OBS data 

*************** read Forcing Model data
*=================================================== 
    say 'sdfopen /Users/ctang/climate/CMIP5/monthly/'Forcevar.j'/hist/'ForcingGCM'/'Forcevar.j'_Amon_'ForcingGCM'_historical_r1i1p1_200101-200212.'monthlab'.ymon.mean.nc' 
    'sdfopen /Users/ctang/climate/CMIP5/monthly/'Forcevar.j'/hist/'ForcingGCM'/'Forcevar.j'_Amon_'ForcingGCM'_historical_r1i1p1_200101-200212.'monthlab'.ymon.mean.nc' 

    'set dfile 1'
    'set lon 3 107'
    'set lat -37 -3'
    'q file'

    'define force=('Forcevar.j')*('Forcecrs.j')+('Forcepls.j')'
    'define forceave=ave('Forcevar.j',t=1,t=6)*('Forcecrs.j')+('Forcepls.j')'
    'define forcestd=sqrt(ave(pow(force-forceave,2),t=1,t=6))'

*=================================================== 
**** define the differences
* Interplation ForcingGCM data to 'OBSproj' GRID
    'define Fvarrmp=lterp(forceave,obsave)'
    'define biasForcevar=(Fvarrmp-obsave)'

    'close 1'

*************** read RegCM data
*=================================================== 
    'open 'RCMDIR'/'RCMtag'.'RegCMtag.j'.ymon.mean.'YEARtag'.'monthlab'.nc.ctl'
    say 'open 'RCMDIR'/'RCMtag'.'RegCMtag.j'.ymon.mean.'YEARtag'.'monthlab'.nc.ctl'
    'set dfile 1'
    'q file'

    'set lon 3 107'
    'set lat -37 -3'

    'define mod=('Modelvar.j')*('Modelcrs.j')+('Modelpls.j')'
    'define modave=ave('Modelvar.j',t=1,t=6)*('Modelcrs.j')+('Modelpls.j')'
    'define modstd=sqrt(ave(pow(mod-modave,2),t=1,t=6))'

*=================================================== 
**** define the differences
* Interplation RegCM data to 'OBSproj' GRID
    'define modavermp=lterp(modave,obsave)'
    'define biasRCMvar=(modavermp-obsave)'

***************** START plotting *******************
*============================ START plotting OBS ( have to start from 1 )
* plot num of obs
  pnobs=(j-1)*LINE+1
  say 'plot num of obs ==================='pnobs''
*--------------------------------------------------- 
    'subplot 'totalp' 'pnobs' 'jmax' -xs -0.5 -ys -0.2 '
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
*--------------------------------------------------- 
  'run colors.gs'
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur.j''

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''

  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 'OBSproj.j' ('Unit.j')'
* x left: decrease
* y down: decrease

  'd obsave'
* ----------------------------- to draw mean bias
  'd aave(obsave,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
*  meanbias: C_format = "%.2f"
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* -yo down: decrease
* -xo left: decrease

  'cbarn 0.45 0 5.5 2.16'
*run cbarn sf vert xmid ymid
*
*sf   - scale the whole bar 1.0 = original 0.5 half the size, etc.
*vert - 0 FORCES a horizontal bar = 1 a vertical bar
*xmid - the x position on the virtual page the center the bar
*ymid - the x position on the virtual page the center the bar
* down: decrease
*
*if vert,xmid,ymid are not specified, they are selected
*as in the original algorithm
*=============================== END plotting OBS data 


*=============================== START plotting OBS std
* plot num of obs
  pnobs=(j-1)*LINE+2
  say 'plot num of obs std ==================='pnobs''
*--------------------------------------------------- 
    'subplot 'totalp' 'pnobs' 'jmax' -xs -0.5 -ys -0.2 '
* 20=total NO. of plots; k= plot num.; 3 NO.of column

*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
*    'set strsiz 0.2 0.2'
* string size horizental vertical' for 'monthlab'

*--------------------------------------------------- 
  say '--------OBS OBS OBS OBS-std --------- plot number is 'pnobs''
  'run colors.gs'
  'color 'stdmin.j' 'stdmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd obsstd'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 std of 'OBSproj.j' ('Unit.j')'
* x left: decrease
* y down: decrease

  'cbarn 0.45 0 5.5 2.16'
* ----------------------------- to draw mean bias
  'd aave(obsstd,lon=0,lon=110,lat=-37,lat=-3)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
*  meanbias: C_format = "%.2f"
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
*=============================== END plotting OBS std

*============================ START plotting ForcingGCM data:
* num of forcing data map:
    m1=(j-1)*LINE+3
    say 'plot num of forcing data='m1''
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm1''
*--------------------------------------------------- 
    'subplot 'totalp' 'm1' 'jmax' -xs -0.5 -ys -0.2 '
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd forceave'

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 'ForcingGCM' output'
* x left: decrease
* y down: decrease

  'cbarn 0.45 0 5.5 2.16'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* ----------------------------- to draw mean bias
  'd aave(Fvarrmp,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
*  meanbias: C_format = "%.2f"
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
*============================ END to plot forcing model



*============================ START plotting ForcingGCM std 
* plot num 
    m2=(j-1)*LINE+4
    say 'plot num ='m2''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm2''
*--------------------------------------------------- 
    'subplot 'totalp' 'm2' 'jmax' -xs -0.5 -ys -0.2'
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'stdmin.j' 'stdmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd forcestd'

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 std of 'Plotvar.j' 'ForcingGCM''
* x left: decrease
* y down: decrease
  'cbarn 0.45 0 5.5 2.16'

  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* ----------------------------- to draw mean bias
  'd aave(forcestd,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
*============================ END plotting ForcingGCM std



*============================ START plotting ForcingGCM bias
*--------------------------------------------------- 
* plot num 
    m3=(j-1)*LINE+5
    say 'plot num ='m3''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm3''
*--------------------------------------------------- 
    'subplot 'totalp' 'm3' 'jmax' -xs -0.5 -ys -0.2'
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'biasmin.j' 'biasmax.j' -kind 'couleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd biasForcevar'

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 'ForcingGCM' - 'OBSproj.j''
* x left: decrease
* y down: decrease

  'cbarn 0.45 0 5.5 2.16'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* ----------------------------- to draw mean bias
  'd aave(biasForcevar,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
*============================ END plotting ForcingGCM bias



*============================ START plotting RegCM 
*--------------------------------------------------- 
* plot num 
    m4=(j-1)*LINE+6
    say 'plot num ='m4''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm4''
*--------------------------------------------------- 
    'subplot 'totalp' 'm4' 'jmax' -xs -0.5 -ys -0.2'
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd modave'

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 RegCM output'
* x left: decrease
* y down: decrease

  'cbarn 0.45 0 5.5 2.16'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* ----------------------------- to draw mean bias
  'd aave(modave,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
*============================ END plotting RegCM


*============================ START plotting RegCM std
*--------------------------------------------------- 
* plot num 
    m5=(j-1)*LINE+7
    say 'plot num ='m5''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm5''
*--------------------------------------------------- 
    'subplot 'totalp' 'm5' 'jmax' -xs -0.5 -ys -0.2'
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'stdmin.j' 'stdmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd modstd'

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 std of RegCM'
* x left: decrease
* y down: decrease

  'cbarn 0.45 0 5.5 2.16'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* ----------------------------- to draw mean bias
  'd aave(modstd,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
*============================ END plotting RegCM std


*============================ START plotting RegCM bias OBS
*--------------------------------------------------- 
* plot num 
    m6=(j-1)*LINE+8
    say 'plot num ='m6''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm6''
*--------------------------------------------------- 
    'subplot 'totalp' 'm6' 'jmax' -xs -0.5 -ys -0.2'
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'biasmin.j' 'biasmax.j' -kind 'couleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd biasRCMvar'

  'set strsiz 0.14 0.10'
  'set string 1 l 2 90'
*  'draw string 3.3 3 'YEARtag''
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 RegCM - 'OBSproj.j''
* x left: decrease
* y down: decrease

  'cbarn 0.45 0 5.5 2.16'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* ----------------------------- to draw mean bias
  'd aave(biasRCMvar,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
*============================ END plotting RegCM bias OBS



*============================ START plotting RegCM bias ForcingGCM
**** define the differences
* Interplation RegCM data to ForcingGCM
    'define Mvarrmp=lterp(modave,forceave)'
    'define biasMFvar=(Mvarrmp-forceave)'
*--------------------------------------------------- 
* plot num 
    m7=(j-1)*LINE+9
    say 'plot num ='m7''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm7''
*--------------------------------------------------- 
    'subplot 'totalp' 'm7' 'jmax' -xs -0.5 -ys -0.2'
* 20=total NO. of plots; k= plot num.; 3 NO.of column
*--------------------------------------------------- 
    'set xlopts 1 1 0.11'
    'set ylopts 1 1 0.08'
*   'sel xlopts color thickness size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'biasmin.j' 'biasmax.j' -kind 'couleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd biasMFvar'

  'set strsiz 0.14 0.10'
  'set string 1 tc 2 0'
* set string color <justification <thickness <rotation>>>
  'draw string 5.5 4.4 RegCM - 'ForcingGCM''
* x left: decrease
* y down: decrease

  'cbarn 0.45 0 5.5 2.16'
  'drawstr -p 12 -k 2 -z 0.1 -t 'monthlab' -xo -0.2 -yo 0.1'
* ----------------------------- to draw mean bias
  'd aave(biasMFvar,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 2 -z 0.1 -t 'meanbias' -xo -0.2 -yo -1.2 %3.2f'
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
