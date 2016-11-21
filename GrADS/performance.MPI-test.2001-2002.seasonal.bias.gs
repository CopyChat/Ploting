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
*  OBSvar.3='rsds'
  OBSvar.3='sfc_sw_down_all'
  OBScrs.3='1'
  OBSpls.3='0'
endif


if(OBSproj.4='MODIS')
  OBSvar.4='clt'
  OBScrs.4='1'
  OBSpls.4='0'
endif

#=============================== Forcing data
ForcingGCM='MPI-ESM-LR'

* ForcingGCM ouput var name in RegCM:
Forcevar.1='tas'
Forcevar.2='pr'
Forcevar.3='rsds'
Forcevar.4='clt'

* ForcingGCM cross factor:
Forcecrs.1='1'
Forcecrs.2='86400'
Forcecrs.3='1'
Forcecrs.4='1'

* ForcingGCM plus factor:
Forcepls.1='-273.5'
Forcepls.2='0'
Forcepls.3='0'
Forcepls.4='1'

*=============================== RegCM data
RCMtag='MPI_hist'
YEARtag='2001-2002'
RCMDIR='/Users/ctang/climate/Modeling/MPI-test/output_1/pprcmdata/monthly'

* RegCM Variable to be ploted
Plotvar.1='TEMP'
Plotvar.2='Precip'
Plotvar.3='SWD'
Plotvar.4='TCC'

* Varibale units to be ploted:
Unit.1='degC'
Unit.2='mm/day'
Unit.3='W/m2'
Unit.4='%'

* RegCM output tag:
RegCMtag.1='SRF'
RegCMtag.2='SRF'
RegCMtag.3='SRF'
RegCMtag.4='RAD'

* model ouput var name in RegCM:
Modelvar.1='s01tas'
Modelvar.2='pr'
Modelvar.3='rsds'
Modelvar.4='clt'

* RegCM cross factor:
Modelcrs.1='1'
Modelcrs.2='86400'
Modelcrs.3='1'
Modelcrs.4='100'

* RegCM plus factor:
Modelpls.1='-273.5'
Modelpls.2='0'
Modelpls.3='0'
Modelpls.4='1'

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

  obsmin.1=0
  obsmax.1=30
  obsmin.2=0
  obsmax.2=8
  obsmin.3=80
  obsmax.3=320
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

#=================================================== title
* obs plot title: 
OBSt=''Plotvar'_'OBSproj.j' ('Unit')'

* title of the plot
TITLE='"biases vs 'OBSproj.j' of 'Plotvar'"'

#=================================================== output
* output file name:
output='performance.RegCM_'ForcingGCM'_'YEARtag'_'monthlab''

******************************** to plot
  'reinit'
  'set gxout shaded'
  'set grads off'
  'set grid off'
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
** model
k=1; kmax=1  
*================================================== 
** variable
j=1; jmax=4
n=jmax*k+1
totalp=6*jmax
  say 'totalplot='totalp''

*=================================================== 
*=================================================== 
n=1
while(j<=jmax)
****** BEGIN read OBS data 
    if(OBSproj.j='ERA_Interim')
      if(OBSvar.j='t2m')
        'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/ERA_Interim/ERA.t2m.ymon.mean.'YEARtag'.'monthlab'.nc'
        say 'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/ERA_Interim/ERA.t2m.ymon.mean.'YEARtag'.'monthlab'.nc'
      else
        'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/ERA_Interim/ERA.tp.ymon.mean.'YEARtag'.'monthlab'.nc'
      endif
    endif
    if(OBSproj.j='GPCP')
      say 'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/GPCP/precip.ymon.mean.'YEARtag'.'monthlab'.nc'
      'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/GPCP/precip.ymon.mean.'YEARtag'.'monthlab'.nc'
    endif
    if(OBSproj.j='CERES')
      say 'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/CERES/CERES_EBAF-Surface_Ed2.7_Subset.ymon.mean.'YEARtag'.'monthlab'.nc'
      'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/CERES/CERES_EBAF-Surface_Ed2.7_Subset.ymon.mean.'YEARtag'.'monthlab'.nc'
    endif
    if(OBSproj.j='TRMM')
      say 'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/TRMM/TRMM.hrf.ymon.mean.'YEARtag'.'monthlab'.nc'
      'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/TRMM/TRMM.hrf.ymon.mean.'YEARtag'.'monthlab'.nc'
    endif
    if(OBSproj.j='CRU')
      'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/CRU/3.20/cru_ts3.20.tmp.ymon.mean.'YEARtag'.'monthlab'.nc'
      say 'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/CRU/3.20/cru_ts3.20.tmp.ymon.mean.'YEARtag'.'monthlab'.nc'
    endif
    if(OBSproj.j='MODIS')
      say 'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/MODIS/clt/clt_MODIS_L3_C5_200101-200212.ymon.mean.'monthlab'.nc'
      'sdfopen /Users/ctang/climate/GLOBALDATA/OBSDATA/MODIS/clt/clt_MODIS_L3_C5_200101-200212.ymon.mean.'monthlab'.nc'
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
** RRTM-CERES
* Interplation RegCM data to 'OBSproj' GRID
* Interplation ForcingGCM data to 'OBSproj' GRID
    'define Fvarrmp=lterp(forceave,obsave)'
    'define biasForcevar=(Fvarrmp-obsave)'

*    'display forceave'
*    'fprintf forceave forceave.txt'
*    'fprintf Fvarrmp Fvarrmp.txt'
*    'fprintf obsave obsave.txt'
    'close 1'
*=================================================== 
*=================================================== read RegCM data:
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
* Interplation ForcingGCM data to 'OBSproj' GRID
    'define modavermp=lterp(modave,obsave)'
    'define biasRCMvar=(modavermp-obsave)'

*============================ to plot OBS ( have to start from 1 )
* plot num of obs
  pnobs=(j-1)*6+1
  say 'plot num of obs='pnobs''
*--------------------------------------------------- 
*    'subplot 'totalp' 'pnobs' 'jmax' -tall 1 '
    'subplot 'totalp' 'pnobs' 'jmax' '
* 20=total NO. of plots; k= plot num.; 3 NO.of column

*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
*   'sel xlopts color thckns size' for the axis
*    'set strsiz 0.2 0.2'
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  say '--------OBS OBS OBS OBS--- plot number is 'pnobs''
  'run colors.gs'
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd obsave'
  'cbarn 0.6 0 5.5 1.5'
  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
  'draw title 'OBSproj.j' ('Unit.j')'
  'draw ylab 'YEARtag''

* ----------------------------- to draw mean bias
  'd aave(obsave,lon=0,lon=110,lat=-37,lat=-3)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
*  meanbias: C_format = "%.2f"
  say 'meanbias='meanbias
  'drawstr -p 12 -k 5 -z 0.25 -t 'meanbias' -xo -0.3 -yo -1.6 %g'
*============================ END to plot forcing model
*  font thickness are controlled by cbarn.gs in /usr/local/grads-2.0.2/lib/scripts
*  by 'set string color <justification <thickness <rotation>>>'
*  'xcbar 0.6 0 5.5 1.5 -fw 0.15 -fh 0.18 -edge triangle -fs 2 -fo 1'

*============================ to plot forcing ForcingGCM data:
*============================ to plot forcing ForcingGCM data:
*============================ to plot forcing ForcingGCM data:
* num of forcing data map:
    m1=(j-1)*6+2
    say 'plot num of forcing data='m1''
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm1''
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
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd forceave'
*  'd Fvarrmp'
  'draw title 'ForcingGCM' output'
  'cbarn 0.6 0 5.5 1.5'
  'draw ylab 'YEARtag''
  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
* ----------------------------- to draw mean bias
  'd aave(Fvarrmp,global)'
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
    m2=(j-1)*6+3
    say 'plot num ='m2''
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
  'color 'obsmin.j' 'obsmax.j' -kind 'OBScouleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd modave'
  'draw title RegCM output'
  'cbarn 0.6 0 5.5 1.5'
  'draw ylab 'YEARtag''
  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
* ----------------------------- to draw mean bias
  'd aave(modave,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 5 -z 0.25 -t 'meanbias' -xo -0.3 -yo -1.6'
*============================ END to plot forcing model



*============================ to plot bias of Forcing data:

*--------------------------------------------------- 
* plot num 
    m3=(j-1)*6+4
    say 'plot num ='m3''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm3''
*--------------------------------------------------- 

*    'subplot 'totalp' 'm3' 'jmax' -tall 1'
    'subplot 'totalp' 'm3' 'jmax' '
* 20=total NO. of plots; k= plot num.; 3 NO.of column

*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
    'set font 0.1 small small arial'
*   'sel xlopts color thckns size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'biasmin.j' 'biasmax.j' -kind 'couleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd biasForcevar'
  'draw title 'ForcingGCM' - 'OBSproj.j''
  'cbarn 0.6 0 5.5 1.5'
  'draw ylab 'YEARtag''
  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
* ----------------------------- to draw mean bias
  'd aave(biasForcevar,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 5 -z 0.25 -t 'meanbias' -xo -0.3 -yo -1.6'
*============================ END bias of forcing data



*============================ to plot bias of RegCM output

*--------------------------------------------------- 
* plot num 
    m4=(j-1)*6+5
    say 'plot num ='m4''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm4''
*--------------------------------------------------- 

*    'subplot 'totalp' 'm4' 'jmax' -tall 1'
    'subplot 'totalp' 'm4' 'jmax' '
* 20=total NO. of plots; k= plot num.; 3 NO.of column

*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
    'set font 0.1 small small arial'
*   'sel xlopts color thckns size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'biasmin.j' 'biasmax.j' -kind 'couleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd biasRCMvar'
  'draw title RegCM - 'OBSproj.j''
  'cbarn 0.6 0 5.5 1.5'
  'draw ylab 'YEARtag''
  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
* ----------------------------- to draw mean bias
  'd aave(biasRCMvar,global)'
  meanbias1=sublin(result,1)
  meanbias = subwrd(meanbias1,4)
*  meanbias = math_nint(meanbias1)
  say 'meanbias='meanbias
  'drawstr -p 12 -k 5 -z 0.25 -t 'meanbias' -xo -0.3 -yo -1.6'
*============================ END to plot bias of forcing model



*============================ to plot RegCM output - Forcing 

**** define the differences
* Interplation RegCM data to ForcingGCM
    'define Mvarrmp=lterp(modave,forceave)'
    'define biasMFvar=(Mvarrmp-forceave)'
*--------------------------------------------------- 
* plot num 
    m5=(j-1)*6+6
    say 'plot num ='m5''
*--------------------------------------------------- 
    say '-------No. 'j' variable is 'Plotvar.j'------ plot number is 'm5''
*--------------------------------------------------- 

*    'subplot 'totalp' 'm5' 'jmax' -tall 1'
    'subplot 'totalp' 'm5' 'jmax' '
* 20=total NO. of plots; k= plot num.; 3 NO.of column

*--------------------------------------------------- 
    'set xlopts 1 4 0.15'
    'set ylopts 1 4 0.15'
    'set font 0.1 small small arial'
*   'sel xlopts color thckns size' for the axis
* string size horizental vertical' for 'monthlab'
*--------------------------------------------------- 
  'run colors.gs'
  'color 'biasmin.j' 'biasmax.j' -kind 'couleur.j''
* 'color -var biasmodave -kind blue->white->red'
  'd biasMFvar'
  'draw title RegCM - 'ForcingGCM''
  'cbarn 0.6 0 5.5 1.5'
  'draw ylab 'YEARtag''
  'drawstr -p 12 -k 5 -z 0.25 -t 'monthlab' -xo -0.3'
* ----------------------------- to draw mean bias
  'd aave(biasMFvar,global)'
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
