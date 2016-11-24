#!/usr/bin/env python

########################################
#Globale Karte fuer tests
# from Rabea Amther
########################################
# http://gfesuite.noaa.gov/developer/netCDFPythonInterface.html

import math
import numpy as np
import pylab as pl
import netCDF4
from netCDF4 import num2date
import Scientific.IO.NetCDF as IO
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.lines as lines

pl.close('all')

########################## for CMIP5 charactors
OBSDIR='/Users/ctang/climate/GLOBALDATA/OBSDATA/SSR_changes_SWIO'

ProjOBS=['NCEP-NCAR','ERA_Interim','CM_SAF-CDR','CM_SAF-SARAH-E','CERES']

OBSfile=[\
        'dswrf.sfc.gauss.yearmean.fldmean.1948-2015.swio.nc',\
        'ERA.ssrd.ssr.ssrc.yearmean.1979-2014.fldmean.swio.nc',\
        'SISmm.CDR.yearmean.fldmean.198301-200512.swio.nc',\
        'SISmm.SARAH-E.yearmean.fldmean.199901-201512.swio.nc',\
        'rsds_CERES-EBAF_L3B_Ed2-8_2001-2013.swio.fldmean.yearmean.nc']
        

VARIABLE=['dswrf','ssrd','SIS','SIS','rsds']

COLORtar=['black','dodgerblue','deeppink','darkgreen',\
        'brown','chocolate',\
        'green','yellowgreen','aqua','olive','teal',\
        'blue','purple','darkmagenta','fuchsia','indigo',\
        'dimgray','black','navy']

linestyles=['_', '_', '_', '_', '_',\
        '--','--','--', '--',\
        '_', '-', '--', ':']
#================================================ CMIP5 models
print "==============================================="

#=================================================== define the Plot:

fig1=plt.figure(figsize=(16,9))
ax = fig1.add_subplot(111)
plt.xlabel('Year',fontsize=16)  
plt.ylabel('Surface Downwelling Solar Radiation ( W/m2 )',fontsize=16)
plt.title("Surface Downwelling Solar Radiation over the SWIO",fontsize=18)
# vertical range ylim yrange
plt.ylim(215,245)
plt.xlim(1948,2016)
plt.grid()

plt.xticks(np.arange(1950, 2016, 5))
plt.tick_params(axis='both', which='major', labelsize=14)
plt.tick_params(axis='both', which='minor', labelsize=14)

#=================================================== 3 windows
#plt.axvspan(1950, 1980, alpha=0.2, color='teal')
plt.axvspan(1980, 2000, alpha=0.2, color='teal')
#plt.axvspan(2000, 2016, alpha=0.2, color='teal')
#=================================================== draw lines
#plt.axvline(x=2005,linewidth=2, color='gray')
plt.axhline(y=0,linewidth=2, color='gray')



for obs in ProjOBS:

    infile1=OBSDIR+'/'+OBSfile[ProjOBS.index(obs)]
    print('the file is == ' +infile1)

    #open input files
    infile=IO.NetCDFFile(infile1,'r')

    # read the time
    TIME=netCDF4.num2date(infile.variables['time'][:],\
            infile.variables['time'].units,\
            calendar=infile.variables['time'].calendar)
    TIME=[t.year for t in TIME]

    # read the variable
    SSR=infile.variables[VARIABLE[ProjOBS.index(obs)]][:,0,0].copy()

#=================================================== to plot
    print "======== to plot =========="

    print 'NO. of year:',len(TIME)
    print TIME
    print SSR

    #plot only target models
    plt.plot(TIME,SSR,\
        label=obs,\
        #linestyles[TargetModel.index(Model)],\
        color=COLORtar[ProjOBS.index(obs)],\
        linewidth=2)

plt.legend(loc=1)
plt.show()
quit()

