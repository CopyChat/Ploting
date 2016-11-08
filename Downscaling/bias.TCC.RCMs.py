#!/usr/bin/env python
########################################
#Globale Karte fuer tests
# from Rabea Amther
########################################
# http://gfesuite.noaa.gov/developer/netCDFPythonInterface.html

import math
import numpy as np
import pylab as pl
import Scientific.IO.NetCDF as IO
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import matplotlib.lines as lines
from mpl_toolkits.basemap import Basemap , addcyclic
from matplotlib.colors import LinearSegmentedColormap
import textwrap

pl.close('all')

########################## for CMIP5 charactors
DIR='/Users/tang/climate/CORDEX/'
VARIABLE='clt'
PRODUCT='Amon'
ENSEMBLE='r1i1p1'
EXPERIMENT='hist'
TIME='195001-200512'

OBS='CRU'
OBS='MODIS'

K=0

DriModels=['CCCma-CanESM2',\
        'CNRM-CERFACS-CNRM-CM5',\
        'CNRM-CERFACS-CNRM-CM5',\
        'CSIRO-QCCCE-CSIRO-Mk3-6-0',\
        'ICHEC-EC-EARTH',\
        'ICHEC-EC-EARTH',\
        'ICHEC-EC-EARTH',\
        'ICHEC-EC-EARTH',\
        'IPSL-IPSL-CM5A-MR',\
        'MIROC-MIROC5',\
        'MOHC-HadGEM2-ES',\
        'MOHC-HadGEM2-ES',\
        'MPI-M-MPI-ESM-LR',\
        'MPI-M-MPI-ESM-LR',\
        'NCC-NorESM1-M',\
        'NOAA-GFDL-GFDL-ESM2M']

nameGCMs=['CanESM2',\
        'CNRM-CM5',\
        'CNRM-CM5',\
        'CSIRO-Mk3-6-0',\
        'EC-EARTH',\
        'EC-EARTH',\
        'EC-EARTH',\
        'EC-EARTH',\
        'IPSL-CM5A-MR',\
        'MIROC5',\
        'HadGEM2-ES',\
        'HadGEM2-ES',\
        'MPI-ESM-LR',\
        'MPI-ESM-LR',\
        'NorESM1-M',\
        'GFDL-ESM2M']
RCMs=['SMHI-RCA4_v1',\
        'CLMcom-CCLM4-8-17_v1',\
        'SMHI-RCA4_v1',\
        'SMHI-RCA4_v1',\
        'CLMcom-CCLM4-8-17_v1',\
        'KNMI-RACMO22T_v1',\
        'DMI-HIRHAM5_v2',\
        'SMHI-RCA4_v1',\
        'SMHI-RCA4_v1',\
        'SMHI-RCA4_v1',\
        'CLMcom-CCLM4-8-17_v1',\
        'SMHI-RCA4_v1',\
        'CLMcom-CCLM4-8-17_v1',\
        'SMHI-RCA4_v1',\
        'SMHI-RCA4_v1',\
        'SMHI-RCA4_v1']

nameRCMs=['RCA4_v1',\
        'CCLM4-8-17_v1',\
        'RCA4_v1',\
        'RCA4_v1',\
        'CCLM4-8-17_v1',\
        'RACMO22T_v1',\
        'HIRHAM5_v2',\
        'RCA4_v1',\
        'RCA4_v1',\
        'RCA4_v1',\
        'CCLM4-8-17_v1',\
        'RCA4_v1',\
        'CCLM4-8-17_v1',\
        'RCA4_v1',\
        'RCA4_v1',\
        'RCA4_v1']

ENSEMBLE=['r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r12i1p1',\
        'r1i1p1',\
        'r3i1p1',\
        'r12i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1']

COLOR=['darkred','darkblue','darkgreen','deeppink',\
        'black','orangered','cyan','magenta']


# read CRU data:
if OBS == 'CRU':
    oVar='cld'
    obs1='~/climate/GLOBALDATA/OBSDATA/CRU/3.22/cru_ts3.22.2001.2005.cld.summer.mean.AFR.nc'
else:
# read MODIS data:
    oVar='clt'
    obs1='/Users/tang/climate/GLOBALDATA/OBSDATA/MODIS/clt_MODIS_L3_C5_200101-200512.ymonmean.NDJFMA.AFR.nc'
print obs1
obsfile1=IO.NetCDFFile(obs1,'r')
ObsVar=obsfile1.variables[oVar][0][:][:].copy()



for idx,Model in enumerate(DriModels):
    if OBS == 'CRU':
        infile1=DIR+EXPERIMENT+'/'+Model+'/'\
                'clt_AFR-44_'+Model+'_historical_'+ENSEMBLE[idx]+'_'+RCMs[idx]+\
                '_mon_200101-200512.nc.summer.mean.nc.remap.cru.nc'
            #clt_AFR-44_MPI-M-MPI-ESM-LR_historical_r1i1p1_SMHI-RCA4_v1_mon_199101-200012.nc.summer.mean.nc
    else:
        infile1=DIR+EXPERIMENT+'/'+Model+'/'\
                'clt_AFR-44_'+Model+'_historical_'+ENSEMBLE[idx]+'_'+RCMs[idx]+\
                '_mon_200101-200512.nc.summer.mean.nc.rempa.modis.nc'
    print infile1

    #open input files
    infile1=IO.NetCDFFile(infile1,'r')

    # read the variables:
    lat = infile1.variables['lat'][:].copy()
    lon = infile1.variables['lon'][:].copy()

    VAR=infile1.variables[VARIABLE][0,:,:].copy()
    print 'the variable tas ===============: ' 
    print VAR

    print np.shape(VAR)
    print np.shape(ObsVar)

    Bias=VAR-ObsVar

    print np.shape(Bias)

    #quit()

    CoLev=10  #number of levels of colorbar
#=================================================== to plot
    fig=plt.subplot(4,4,idx+1,aspect='equal')
    print "============="
    print idx; print Model
    map=Basemap(projection='cyl',llcrnrlat=np.min(lat),urcrnrlat=np.max(lat),\
            llcrnrlon=np.min(lon),urcrnrlon=np.max(lon),resolution='h')
    map.drawcoastlines(linewidth=0.45)
    map.drawparallels(np.arange(-90.,91.,15.),labels=[1,0,0,0],linewidth=0.55)
    map.drawmeridians(np.arange(-180.,181.,20.),labels=[0,0,0,1],linewidth=0.55)
    map.drawmapboundary()
    x,y=map(lon,lat)
    cmap=plt.get_cmap('bwr')
    #cmap=plt.get_cmap('RdBu_r')
    pic=map.pcolormesh(x,y,Bias,cmap=cmap)
    plt.title(nameGCMs[idx]+' => '+nameRCMs[idx])
    #plt.figtext(0.68,0.73,timestamp, size="small") 

    #set the same colorbar range
    pic.set_clim(vmin=-50,vmax=50)
    plt.subplots_adjust(bottom=0.1, right=0.8, top=0.9)
    cax = plt.axes([0.85, 0.1, 0.01, 0.8])
    plt.colorbar(cax=cax)

    #if idx > 11:
        #plt.colorbar(orientation='horizontal') # draw colorbar


#plt.legend(loc=2)
plt.suptitle('seasonal mean bias of Total Cloud Cover (%) vs MODIS',fontsize=16)
plt.show()
quit()




