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
#from matplotlib.dates import DayLocator, HourLocator, DateFormatter, drange


pl.close('all')
########################## to plot OBSs:

# all the plot file shoud be here:
OBSDIR='/Users/ctang/climate/CORDEX/SSR_southern_Africa'

ProjOBSnc=['NCEP-NCAR','ERA_40','ERA_Interim',\
        'CM_SAF-CDR','CM_SAF-SARAH-E','CERES']

ProjOBStxt=['MeteoFrance_39site_RUN',\
        'MeteoFrance_GILLOT',\
        'HelioClim-1']

OBSncfile=[\
        'dswrf.sfc.gauss.yearmean.1948-2016.SA.fldmean.nc',\
        'ERA_40.ssrd.ssr.ssrc.yearmean.1958-2001.SA.fldmean.nc',\
        'ERA.ssrd.ssr.ssrc.yearmean.1979-2014.SA.fldmean.nc',\
        'SISmm.CDR.yearmean.198301-200512.swio.SA.fldmean.nc',\
        'SISmm.SARAH-E.yearmean.199901-201512.swio.SA.fldmean.nc',\
        'rsds_CERES-EBAF_L3B_Ed2-8_2001-2013.SA.year.fldmean.nc']
    
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
plt.title("Surface Downwelling Solar Radiation over southern Africa",fontsize=18)

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


#=================================================== 
##### to plot the cmip5 model

cmip5_1='rsds.ensmean.9.cmip5.1961-2050.SA.nc'
cmip5_2='rsds.ensstd.9.cmip5.1961-2050.SA.nc'

infile1=OBSDIR+'/'+cmip5_1
infile2=OBSDIR+'/'+cmip5_2

print('the file is == ' +infile1)

#open input files
meanfile=IO.NetCDFFile(infile1,'r')
stdfile=IO.NetCDFFile(infile2,'r')

# read the time to datetime
TIME=netCDF4.num2date(meanfile.variables['time'][:],\
        meanfile.variables['time'].units,\
        calendar=meanfile.variables['time'].calendar)

print TIME

# read the variable mean
SSRmean=meanfile.variables['rsds'][:,0,0].copy()
SSRstd=stdfile.variables['rsds'][:,0,0].copy()


# 5-95% range ( +-1.64 STD)
StdTemp1=[SSRmean[i]+SSRstd[i]*1. for i in range(0,len(SSRmean))]
StdTemp2=[SSRmean[i]-SSRstd[i]*1. for i in range(0,len(SSRmean))]


plt.plot(TIME,SSRmean,label='CMIP5 ensemble mean',color="black",\
        linewidth=3)
plt.plot(TIME,StdTemp1,color="black",linewidth=0.1)
plt.plot(TIME,StdTemp2,color="black",linewidth=0.1)
plt.fill_between(TIME,StdTemp1,StdTemp2,color='black',alpha=0.3)


#=================================================== 
##### to plot the cordex models

cmip5_1='rsds_AFR-44_year.fldmean.swio.hist-rcp85.1961-2050.ensmean.nc'
cmip5_2='rsds_AFR-44_year.fldmean.swio.hist-rcp85.1961-2050.ensstd.nc'

infile1=OBSDIR+'/'+cmip5_1
infile2=OBSDIR+'/'+cmip5_2

print('the file is == ' +infile1)

#open input files
meanfile=IO.NetCDFFile(infile1,'r')
stdfile=IO.NetCDFFile(infile2,'r')

# read the time to datetime
#use the GCM time


# read the variable mean
SSRmean=meanfile.variables['rsds'][:,0,0].copy()
SSRstd=stdfile.variables['rsds'][:,0,0].copy()


# 5-95% range ( +-1.64 STD)
StdTemp1=[SSRmean[i]+SSRstd[i]*1. for i in range(0,len(SSRmean))]
StdTemp2=[SSRmean[i]-SSRstd[i]*1. for i in range(0,len(SSRmean))]


plt.plot(TIME,SSRmean,label='CORDEX ensemble mean',color="blue",\
        linewidth=3)
plt.plot(TIME,StdTemp1,color="blue",linewidth=0.1)
plt.plot(TIME,StdTemp2,color="blue",linewidth=0.1)
plt.fill_between(TIME,StdTemp1,StdTemp2,color='blue',alpha=0.3)

#=================================================== 
### plot Had+RegCM

Had='rsds.Had_hist.SRF.year.mean.1996-2005.SA.fldmean.nc'

infile1=OBSDIR+'/'+Had

print('the file is == ' +infile1)

#open input files
meanfile=IO.NetCDFFile(infile1,'r')

#define the TIME
date1 = datetime.datetime( 1996, 7, 1)
date2 = datetime.datetime( 2005, 7, 1)
delta = datetime.timedelta(days=365)

TIME = drange(date1, date2, delta)


# read the variable mean
SSRmean=meanfile.variables['rsds'][:,0,0].copy()


plt.plot(TIME,SSRmean,label='Had+RegCM',color="Red",\
        linewidth=3)


fig.autofmt_xdate()
plt.legend(loc=2)
plt.show()
quit()

