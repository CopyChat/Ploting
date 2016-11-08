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
DIR='/Users/tang/climate/CMIP5/monthly/rsds/hist/'
VARIABLE='rsds'
PRODUCT='Amon'
ENSEMBLE='r1i1p1'
EXPERIMENT='hist'
TIME='195001-200512'

#OBS='CRU'
OBS='CERES'


season='summer'
#season='winter'

K=0

NonData=['EC-EARTH-XXXX','CSIRO-Mk3-6-0-XXXXXX']
GCMs=[\
        'ACCESS1-0',\
        'BNU-ESM',\
        'CCSM4',\
        'CESM1-BGC',\
        'CESM1-CAM5',\
        'CESM1-FASTCHEM',\
        'CESM1-WACCM',\
        'CMCC-CESM',\
        'CNRM-CM5',\
        'CSIRO-Mk3-6-0',\
        'CanESM2',\
        'EC-EARTH',\
        'FIO-ESM',\
        'GFDL-ESM2M',\
        'GISS-E2-H',\
        'HadGEM2-AO',\
        'HadGEM2-ES',\
        'IPSL-CM5A-LR',\
        'IPSL-CM5A-MR',\
        'MIROC-ESM-CHEM',\
        'MIROC-ESM',\
        'MIROC5',\
        'MPI-ESM-LR',\
        'MPI-ESM-MR',\
        'MPI-ESM-P',\
        'MRI-CGCM3',\
        'MRI-ESM1',\
        'NorESM1-ME',\
        'NorESM1-M',\
        'bcc-csm1-1-m',\
        'bcc-csm1-1',\
        'inmcm4',\
                ]
ENSEMBLE=[ \
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r12i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r2i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        'r1i1p1',\
        ]
        
COLOR=['darkred','darkblue','darkgreen','deeppink',\
        'black','orangered','cyan','magenta']


# read CERES data:
if OBS == 'CERES':
    oVar='rsds'
    obs1='/Users/tang/climate/GLOBALDATA/OBSDATA/CERES/rsds_CERES-EBAF_L3B_Ed2-8_2001-2005.NDJFMA.SWIO.nc'
else:
# read MODIS data:
    oVar='clt'
    obs1='/Users/tang/climate/GLOBALDATA/OBSDATA/MODIS/clt_MODIS_L3_C5_200101-200512.ymonmean.NDJFMA.SWIO.nc'
print obs1
obsfile1=IO.NetCDFFile(obs1,'r')
ObsVar=obsfile1.variables[oVar][0][:][:].copy()




for idx,Model in enumerate(GCMs):
    if OBS == 'CERES':
        infile1=DIR+\
                '/rsds_Amon_'+Model+'_historical_'+ENSEMBLE[idx]+\
                '_200101-200512.summer.remap.CERES.SWIO.nc'
            #GFDL-ESM2M/clt_Amon_GFDL-ESM2M_historical_r1i1p1_200101-200512.nc.summer.mean.nc.remap.nc
            #rsds_Amon_bcc-csm1-1_historical_r1i1p1_200101-200512.summer.remap.CERES.SWIO.nc
    else:
        infile1=DIR+'/'+\
                'clt_Amon_'+Model+'_historical_'+ENSEMBLE[idx]+\
                '_200101-200512.'+season+'.remap.modis.SWIO.nc'
    print infile1

    
    if Model in NonData:
        infile1=obsfile1
        VAR=infile1.variables[oVar][0,:,:].copy()
    else:
        print 'k=',idx
        infile1=IO.NetCDFFile(infile1,'r')
        VAR=infile1.variables[VARIABLE][0,:,:].copy()
    print 'the variable tas ===============: ' 
    print VAR

    #open input files

    # read the variables:
    lat = infile1.variables['lat'][:].copy()
    lon = infile1.variables['lon'][:].copy()


    print np.shape(VAR)
    print np.shape(ObsVar)

    Bias=VAR-ObsVar


    print np.shape(Bias)

    #quit()

    CoLev=10  #number of levels of colorbar
#=================================================== to plot
    fig=plt.subplot(8,4,idx+1,aspect='equal')
    print "============="
    print idx; print Model
    map=Basemap(projection='cyl',llcrnrlat=np.min(lat),urcrnrlat=np.max(lat),\
            llcrnrlon=np.min(lon),urcrnrlon=np.max(lon),resolution='l')
    map.drawcoastlines(linewidth=0.35)
    map.drawparallels(np.arange(-90.,91.,15.),labels=[1,0,0,0],linewidth=0.35)
    map.drawmeridians(np.arange(-180.,181.,20.),labels=[0,0,0,1],linewidth=0.35)
    map.drawmapboundary()
    x,y=map(lon,lat)
    cmap=plt.get_cmap('bwr')
    #cmap=plt.get_cmap('RdBu_r')
    pic=map.pcolormesh(x,y,Bias,cmap=cmap)
    plt.title(GCMs[idx])
    #plt.figtext(0.68,0.73,timestamp, size="small") 

    #set the same colorbar range
    pic.set_clim(vmin=-100,vmax=100)
    plt.subplots_adjust(bottom=0.1, right=0.8, top=0.9)
    cax = plt.axes([0.85, 0.1, 0.01, 0.8])
    plt.colorbar(cax=cax)

    #if idx > 11:
        #plt.colorbar(orientation='horizontal') # draw colorbar


#plt.legend(loc=2)
plt.suptitle('seasonal mean bias of Surface Downwelling SW radiation (W m-2) vs CERES',fontsize=18)
plt.show()
quit()

