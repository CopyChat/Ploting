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
DIR='~/climate/CMIP5/rcp85/SWIO'
VARIABLE='rsds'
PRODUCT='Amon'
ENSEMBLE='r1i1p1'

AbsTemp=273.15
RefTemp=5
CRUmean=8.148 #1900-2100 land

TargetModel=[\
        'CanESM2',\
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
        'HadGEM2-ES',\
        'MPI-ESM-LR',\
        'MPI-ESM-LR',\
        'NorESM1-M',\
        'GFDL-ESM2M',\
        ]

RCMs=[
        'rsds_AFR-44_CCCma-CanESM2_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_CNRM-CERFACS-CNRM-CM5_rcp85_r1i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_CNRM-CERFACS-CNRM-CM5_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_CSIRO-QCCCE-CSIRO-Mk3-6-0_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r12i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r12i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r1i1p1_KNMI-RACMO22T_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r3i1p1_DMI-HIRHAM5_v2_mon_200601-210012.nc',\
        'rsds_AFR-44_IPSL-IPSL-CM5A-MR_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_MIROC-MIROC5_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_MOHC-HadGEM2-ES_rcp85_r1i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_MOHC-HadGEM2-ES_rcp85_r1i1p1_KNMI-RACMO22T_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_MOHC-HadGEM2-ES_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_MPI-M-MPI-ESM-LR_rcp85_r1i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_MPI-M-MPI-ESM-LR_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_NCC-NorESM1-M_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        'rsds_AFR-44_NOAA-GFDL-GFDL-ESM2M_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.nc',\
        ]

GCMs=[
        'CanESM2',\
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
        'HadGEM2-ES',\
        'MPI-ESM-LR',\
        'MPI-ESM-LR',\
        'NorESM1-M',\
        'GFDL-ESM2M',\
        ]


COLORtar=['darkred','black','deeppink','orange',\
        'orangered','yellow','gold','brown','chocolate',\
        'green','yellowgreen','aqua','olive','teal',\
        'blue','purple','darkmagenta','fuchsia','indigo',\
        'dimgray','black','navy']

COLORall=['darkred','darkblue','darkgreen','deeppink',\
        'red','blue','green','pink','gold',\
        'lime','lightcyan','orchid','yellow','lightsalmon',\
        'brown','khaki','aquamarine','yellowgreen','blueviolet',\
        'snow','skyblue','slateblue','orangered','dimgray',\
        'chocolate','teal','mediumvioletred','gray','cadetblue',\
        'mediumorchid','bisque','tomato','hotpink','firebrick',\
        'Chartreuse','purple','goldenrod',\
        'black','orangered','cyan','magenta']
linestyles=['_', '_', '_', '-', '-',\
    '-', '--','--','--', '--',\
    '_', '_','_','_',\
    '_', '_','_','_',\
    '_', '-', '--', ':','_', '-', '--', ':','_', '-', '--', ':','_', '-', '--', ':']
#================================================ CMIP5 models
# for rcp8.5 





#=================================================== define the Plot:

fig1=plt.figure(figsize=(16,9))
ax = fig1.add_subplot(111)
plt.xlabel('Year',fontsize=16)  
plt.ylabel('Surface Downwelling shortwave flux Change(W m-2)',fontsize=16)
plt.title("Surface Downwelling shortwave flux  Change (W m-2) in AFRICA simulated by CMIP5 models",\
        fontsize=18)
plt.ylim(-5,5)
plt.xlim(1980,2100)
plt.grid()

plt.xticks(np.arange(1960, 2100+10, 20))
plt.tick_params(axis='both', which='major', labelsize=14)
plt.tick_params(axis='both', which='minor', labelsize=14)

# vertical at 2005
plt.axvline(x=2005.5,linewidth=2, color='gray')
plt.axhline(y=0,linewidth=2, color='gray')

#plt.plot(x,y,color="blue",linewidth=4)
########################## for rcp8.5:
########################## for rcp8.5:

print "========== for hist ==============="

GCMsDir='/Users/tang/climate/CMIP5/rcp85/AFRICA'
EXPERIMENT='rcp85'
TIME='200601-210012'
YEAR=range(2006,2101)
Nmonth=1140
SumTemp=np.zeros(Nmonth/12)
K=0

for Model in modelist1:
#define the K-th model input file:
    K=K+1 # for average 
    infile1=DIR+'/'\
            +VARIABLE+'_'+PRODUCT+'_'+Model+'_'+EXPERIMENT+'_r1i1p1'+'_'+TIME+'.nc.SWIO.nc'
            #rsds_Amon_MPI-ESM-LR_rcp85_r1i1p1_200601-210012.nc.SWIO.nc
    print('the file is == ' +infile1)

    #open input files
    infile=IO.NetCDFFile(infile1,'r')

    # read the variable tas
    TAS=infile.variables[VARIABLE][:,:,:].copy()
    print 'the variable tas ===============: ' 
    print TAS

    # calculate the annual mean temp:
    TEMP=range(0,Nmonth,12) 
    for j in range(0,Nmonth,12):
        TEMP[j/12]=np.mean(TAS[j:j+11][:][:])-AbsTemp

    print " temp ======================== absolut"
    print TEMP

    # reference temp: mean of 1996-2005
    RefTemp=np.mean(TEMP[0:5])

    if K==1:
        ArrRefTemp=[RefTemp]
    else:
        ArrRefTemp=ArrRefTemp+[RefTemp]
        print 'ArrRefTemp ========== ',ArrRefTemp

    TEMP=[t-RefTemp for t in TEMP]
    print " temp ======================== relative to mean of 1986-2005"
    print TEMP

    # get array of temp K*TimeStep
    if K==1:
        ArrTemp=[TEMP]
    else:
        ArrTemp=ArrTemp+[TEMP]


    SumTemp=SumTemp+TEMP
    #print SumTemp

#=================================================== to plot
    print "======== to plot =========="
    print len(TEMP)

    print 'NO. of year:',len(YEAR)

    #plot only target models
    if  Model in TargetModel:
        plt.plot(YEAR,TEMP,label=Model,\
                #linestyles[TargetModel.index(Model)],\
                color=COLORtar[TargetModel.index(Model)],linewidth=2)




    #if Model=='CanESM2':
        #plt.plot(YEAR,TEMP,color="red",linewidth=1)
    #if Model=='MPI-ESM-LR':
        #plt.plot(YEAR,TEMP,color="blue",linewidth=1)
    #if Model=='MPI-ESM-MR':
        #plt.plot(YEAR,TEMP,color="green",linewidth=1)

#=================================================== for ensemble mean
AveTemp=[e/K for e in SumTemp]
ArrTemp=list(np.array(ArrTemp))
print 'shape of ArrTemp:',np.shape(ArrTemp)
StdTemp=np.std(np.array(ArrTemp),axis=0)
print 'shape of StdTemp:',np.shape(StdTemp)

print "ArrTemp ========================:"
print ArrTemp

print "StdTemp ========================:"
print StdTemp

# 5-95% range ( +-1.64 STD)
StdTemp1=[AveTemp[i]+StdTemp[i]*1.64 for i in range(0,len(StdTemp))]
StdTemp2=[AveTemp[i]-StdTemp[i]*1.64 for i in range(0,len(StdTemp))]

print "Model number for historical is :",K

print "models for historical:";print  modelist1


plt.plot(YEAR,AveTemp,label=' mean',color="red",linewidth=4)
plt.plot(YEAR,StdTemp1,color="black",linewidth=0.1)
plt.plot(YEAR,StdTemp2,color="black",linewidth=0.1)
plt.fill_between(YEAR,StdTemp1,StdTemp2,color='black',alpha=0.3)



# draw NO. of model used:
plt.text(1980,-2,str(K)+' models',size=16,rotation=0.,
        ha="center",va="center",
        #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            )

plt.legend(loc=2)

plt.show()
quit()

########################## for rcp8.5:
########################## for rcp8.5:
