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
from netCDF4 import num2date
import Scientific.IO.NetCDF as IO
import matplotlib.pyplot as plt
import matplotlib.lines as lines
import matplotlib.dates as mdates
from matplotlib.dates import YearLocator,MonthLocator,DateFormatter


pl.close('all')

########################## OBS location:

# all the plot file shoud be here:
OBSDIR='/Users/ctang/climate/GLOBALDATA/OBSDATA/CM_SAF/SIS/CDR_v001/'

ProjOBSnc=[\
        'CM_SAF-CDR']

OBSncfile=['SISmm.CDR.mon.mean.198301-200512.swio.fldmean.nc']
        

VARIABLE=['SIS']

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

fig,ax = plt.subplots(figsize=(16,9))
plt.xlabel('Year',fontsize=16)  
plt.ylabel('Surface Downwelling Solar Radiation ( W/m2 )',fontsize=16)
plt.title("Surface Downwelling Solar Radiation over the SWIO",fontsize=18)

# vertical range ylim yrange
plt.ylim(160,300)
plt.yticks(np.arange(160,300, 20))

plt.grid()

ax.xaxis.set_major_locator(MonthLocator(1)) # interval = 5
ax.xaxis.set_major_formatter(DateFormatter('%Y-%m'))
ax.fmt_xdata = DateFormatter('%m')

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
        'o-',\
        label=obs,\
        color=COLORtar[ProjOBSnc.index(obs)],\
        linewidth=2)

    plt.xlim(TIME[0],TIME[-1])


plt.text(TIME[112],165,'missing_value=-999:1988-12',\
        size=16,rotation=0.,
        ha="center",va="center",
        bbox = dict(boxstyle="round",
            ec=(1., 0.5, 0.5),
            fc=(1., 0.8, 0.8),
            ))

fig.autofmt_xdate()
plt.legend(loc=2)
plt.show()
quit()

