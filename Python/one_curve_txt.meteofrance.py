#!/usr/bin/env python

########################################
#Globale Karte fuer tests
# from Rabea Amther
########################################
# http://gfesuite.noaa.gov/developer/netCDFPythonInterface.html

import os
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
OBSDIR='/Users/ctang/climate/GLOBALDATA/OBSDATA/Meteo-France/39site'
        

ProjOBStxt=['MeteoFrance']

OBStxtfile=['montly.missing.removed']

# to prepare the plot file
#os.environ['OBStxtfile']=str(OBStxtfile[0])
#os.system(" awk 'NR>1{print $2,$6*(10000/3600/24/30)}' $OBStxtfile > time.wm2.temp")

COLOR=['black','dodgerblue','deeppink','darkgreen',\
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
plt.title("monthly mean of SSR over Reunion Island",fontsize=18)

# vertical range ylim yrange
plt.ylim(0,275)
plt.yticks(np.arange(0,275, 20))

#plt.xlim(1948,2016)
plt.grid()

ax.xaxis.set_major_locator(MonthLocator(1)) # interval = 5
ax.xaxis.set_major_formatter(DateFormatter('%Y-%m'))
ax.fmt_xdata = DateFormatter('%Y')

#plt.xticks(np.arange(1950, 2016, 5))
#plt.tick_params(axis='both', which='major', labelsize=14)
#plt.tick_params(axis='both', which='minor', labelsize=14)

#=================================================== 3 windows
#plt.axvspan(1950, 1980, alpha=0.2, color='teal')
#=================================================== draw lines
#plt.axvline(x=2005,linewidth=2, color='gray')
plt.axhline(y=39,linewidth=2, color='gray')



##### to plot the text file:

for obs in ProjOBStxt:
    infile1=OBSDIR+'/'+OBStxtfile[ProjOBStxt.index(obs)]
    print('the file is == ' +infile1)

    TIME,SSR,Histo= np.loadtxt(infile1, unpack=True,\
            converters={ 0: mdates.strpdate2num('%Y-%m')})

    print " plotting text file ================== "
    print TIME
    print SSR

    plt.plot(TIME,SSR,\
        'o-',\
        label=obs,\
        color=COLOR[ProjOBStxt.index(obs)+len(ProjOBStxt)],\
        linewidth=2)

##### to plot the number of data

    plt.bar(TIME,Histo,20,alpha=0.4)

plt.text(TIME[32],65,'number of records, 39 in total',\
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

