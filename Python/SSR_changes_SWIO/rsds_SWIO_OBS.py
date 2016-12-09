#!/usr/bin/env python

########################################
#Globale Karte fuer tests
# from Rabea Amther
########################################
# http://gfesuite.noaa.gov/developer/netCDFPythonInterface.html

import netCDF4
import pylab as pl
import numpy as np
import matplotlib as mpl
import datetime
from netCDF4 import num2date
import Scientific.IO.NetCDF as IO
import matplotlib.pyplot as plt
import matplotlib.lines as lines
import matplotlib.dates as mdates
from matplotlib.dates import YearLocator,MonthLocator,DateFormatter,drange


pl.close('all')
########################## OBS location:

# all the plot file shoud be here:
OBSDIR='/Users/ctang/Code/Plotting/Python/SSR_changes_SWIO'

ProjOBSnc=['NCEP-NCAR','ERA_40','ERA_Interim',\
        'CM_SAF-CDR','CM_SAF-SARAH-E','CERES']

ProjOBStxt=['MeteoFrance_39site_RUN',\
        'MeteoFrance_GILLOT',\
        'HelioClim-1']

OBSncfile=[\
        'dswrf.sfc.gauss.yearmean.fldmean.1948-2015.swio.nc',\
        'ERA_40.ssrd.ssr.ssrc.year.mean.1958-2001.fldmean.swio.nc',\
        'ERA.ssrd.ssr.ssrc.yearmean.1979-2014.fldmean.swio.nc',\
        'SISmm.CDR.yearmean.fldmean.198301-200512.swio.nc',\
        'SISmm.SARAH-E.yearmean.fldmean.199901-201512.swio.nc',\
        'rsds_CERES-EBAF_L3B_Ed2-8_2001-2013.swio.fldmean.yearmean.nc']
        
OBStxtfile=['yearly.meteofrance.missing.removed',\
        'Meteofrance.Gillot.1985-2015.year.mean.txt',\
        'rsds.HelioClim-1.1985-2005.txt']

VARIABLE=['dswrf','ssrd','ssrd','SIS','SIS','rsds']

COLORtar=['black','dodgerblue','darkgreen','pink',\
        'purple','blue','darkmagenta','red','teal',\
        'blue','purple','darkmagenta','fuchsia','indigo',\
        'dimgray','black','navy']

linestyles=['-', '-', '-', '-', '--',\
        '-','-','-', '--',\
        '-', '-', '--', ':']
#================================================ CMIP5 models
print "==============================================="

#=================================================== define the Plot:

fig,ax = plt.subplots(figsize=(16,9))
plt.xlabel('Year',fontsize=16)  
plt.ylabel('Surface Downwelling Solar Radiation ( W/m2 )',fontsize=16)
plt.title("Surface Downwelling Solar Radiation over the SWIO",fontsize=18)

# vertical range ylim yrange
plt.ylim(190,255)
plt.yticks(np.arange(190,255, 10))

plt.xlim(datetime.datetime(1948,01,01),datetime.datetime(2020,12,31))
plt.grid()

ax.xaxis.set_major_locator(YearLocator(5)) # interval = 5
ax.xaxis.set_major_formatter(DateFormatter('%Y-%m'))
ax.fmt_xdata = DateFormatter('%Y')

#plt.xticks(np.arange(1950, 2016, 5))
#plt.tick_params(axis='both', which='major', labelsize=14)
#plt.tick_params(axis='both', which='minor', labelsize=14)

#=================================================== 3 windows
#plt.axvspan(1950, 1980, alpha=0.2, color='teal')
#plt.axvspan(1980, 2000, alpha=0.2, color='teal')
#plt.axvspan(2000, 2016, alpha=0.2, color='teal')
#=================================================== draw lines
#plt.axvline(x=2005,linewidth=2, color='gray')
plt.axhline(y=0,linewidth=2, color='gray')


##### to plot nc file
for obs in ProjOBSnc:

    infile1=OBSDIR+'/'+OBSncfile[ProjOBSnc.index(obs)]
    print('the file is == ' +infile1)

    #open input files
    infile=IO.NetCDFFile(infile1,'r')

    # read the time to datetime
    TIME=netCDF4.num2date(infile.variables['time'][:],\
            infile.variables['time'].units,\
            calendar=infile.variables['time'].calendar)

    #TIME=[t.year for t in TIME]
    #TIME=[t.strftime("%Y-%m") for t in TIME]
    #TIME=mpl.dates.date2num(TIME)

    # read the variable
    SSR=infile.variables[VARIABLE[ProjOBSnc.index(obs)]][:,0,0].copy()

#=================================================== to plot
    print "======== to plot =========="

    print 'NO. of year:',len(TIME)
    print TIME
    print SSR

    #plt.plot_date(mdates.datestr2num(TIME),SSR)
    plt.plot(TIME,SSR,\
        linestyles[ProjOBSnc.index(obs)],\
        label=obs,\
        color=COLORtar[ProjOBSnc.index(obs)],\
        linewidth=2)


##### to plot the text file:

for obs in ProjOBStxt:
    infile1=OBSDIR+'/'+OBStxtfile[ProjOBStxt.index(obs)]
    print('the file is == ' +infile1)

    TIME,SSR= np.loadtxt(infile1, unpack=True,\
            converters={ 0: mdates.strpdate2num('%Y-%m')})

    print " plotting text file ================== "
    print TIME
    print SSR

    plt.plot(TIME,SSR,\
        linestyles[ProjOBStxt.index(obs)+len(ProjOBSnc)],\
        label=obs,\
        color=COLORtar[ProjOBStxt.index(obs)+len(ProjOBSnc)],\
        linewidth=2)


#=================================================== 
## plot the RegCM result driven by Had model

infile1=OBSDIR+'/rsds.Had_hist.SRF.year.mean.1996-2005.SA.fldmean.nc'
print('the file is == ' +infile1)

#open input files
infile=IO.NetCDFFile(infile1,'r')

#define the TIME
date1 = datetime.datetime( 1996, 7, 1)
date2 = datetime.datetime( 2005, 7, 1)
delta = datetime.timedelta(days=365)

TIME = drange(date1, date2, delta)

# read the variable
SSR=infile.variables['rsds'][:,0,0].copy()

#=================================================== to plot
print "======== to plot =========="

print 'NO. of year:',len(TIME)
print TIME
print SSR

#plt.plot_date(mdates.datestr2num(TIME),SSR)
plt.plot(TIME,SSR,\
    linestyles[10],\
    label='Had+RegCM',\
    color=COLORtar[10],\
        linewidth=3)

#=================================================== 
### plot the HadGEM2-ES data

infile1=OBSDIR+'/rsds_Amon_HadGEM2-ES_historical-rcp85_r1i1p1_196101-209912.swiomean.yearmean.nc'
print('the file is == ' +infile1)

#open input files
infile=IO.NetCDFFile(infile1,'r')

#define the TIME
date1 = datetime.datetime( 1961, 7, 1)
date2 = datetime.datetime( 2099, 7, 1)
delta = datetime.timedelta(days=365)

TIME = drange(date1, date2, delta)

# read the variable
SSR=infile.variables['rsds'][:,0,0].copy()

#=================================================== to plot
print "======== to plot =========="

print 'NO. of year:',len(TIME)
print TIME
print SSR

#plt.plot_date(mdates.datestr2num(TIME),SSR)
plt.plot(TIME,SSR,\
    linestyles[10],\
    label='HadGEM2-ES',\
    color=COLORtar[12],\
        linewidth=3)

fig.autofmt_xdate()
plt.legend(loc=2)
plt.show()
quit()

