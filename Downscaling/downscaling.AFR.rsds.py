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

ObsRef=1
########################## for CMIP5 charactors
VARIABLE='rsds'
PRODUCT='Amon'

AbsTemp=273.15
RefTemp=5
CERESmean=225.02 #2001-2010

TargetModel=[\
        #'CCSM4',\
        #'CESM1-BGC',\
        #'CESM1-CAM5',\
        #'CESM1-FASTCHEM',\
        #'CESM1-WACCM',\
        #'CNRM-CM5',\
        #'CSIRO-Mk3-6-0',\
        #'CanESM2',\
        'EC-EARTH',\
        #'GFDL-ESM2G',\
        #'GFDL-ESM2M',\
        #'GISS-E2-H',\
        #'GISS-E2-R-CC',\
        #'HadGEM2-AO',\
        #'HadGEM2-CC',\
        #'HadGEM2-ES',\
        #'IPSL-CM5A-LR',\
        #'IPSL-CM5A-MR',\
        #'MIROC-ESM-CHEM',\
        #'MIROC-ESM',\
        #'MIROC5',\
        #'MPI-ESM-LR',\
        #'MPI-ESM-MR',\
        #'MPI-ESM-P',\
        #'MRI-CGCM3',\
        #'NorESM1-ME',\
        #'bcc-csm1-1-m',\
        #'bcc-csm1-1',\
        #'inmcm4',\
        ]

GCMsCol=[\
        'Magenta',\
        'Snow',\
        ]
COLORtar=[\
        'yellow','Darkturquoise','lime','deeppink',\
        'red','darkmagenta','navy',\
        'deeppink','orange','orangered','yellow','gold','brown','chocolate',\
        'green','yellowgreen','aqua','olive','teal','blue',\
        'purple','darkmagenta','fuchsia','indigo',\
        'dimgray','black','navy']

COLORall=['yellow','Darkturquoise','Lime','deeppink',\
        'orangered','blue','green','pink','gold',\
        'lime','lightcyan','orchid','yellow','lightsalmon',\
        'brown','khaki','aquamarine','yellowgreen','blueviolet',\
        'snow','skyblue','slateblue','orangered','dimgray',\
        'chocolate','teal','mediumvioletred','gray','cadetblue',\
        'mediumorchid','bisque','tomato','hotpink','firebrick',\
        'Chartreuse','purple','goldenrod',\
        'black','orangered','cyan','magenta']
linestyles=['-', '-', '-', '-', '-',\
    '-', '--','--','--', '--',\
    '_', '_','_','_',\
    '_', '_','_','_',\
    '_', '-', '--', ':','_', '-', '--', ':','_', '-', '--', ':','_', '-', '--', ':']

RCMsPlotIndex=[\
        5,\
        6,\
        7,\
        8,\
        ]
RCMsPlotLabels=[\
        'EC-EARTH + CCLM4',\
        'EC-EARTH + RCA4',\
        'EC-EARTH + RACMO22T',\
        'EC-EARTH + HIRHAM5',\
        ]


RCMsHist=[\
        'rsds_AFR-44_CCCma-CanESM2_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_CNRM-CERFACS-CNRM-CM5_historical_r1i1p1_CLMcom-CCLM4-8-17_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_CNRM-CERFACS-CNRM-CM5_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_CSIRO-QCCCE-CSIRO-Mk3-6-0_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_historical_r12i1p1_CLMcom-CCLM4-8-17_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_historical_r12i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_historical_r1i1p1_KNMI-RACMO22T_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_historical_r3i1p1_DMI-HIRHAM5_v2_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_IPSL-IPSL-CM5A-MR_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_MIROC-MIROC5_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_MOHC-HadGEM2-ES_historical_r1i1p1_CLMcom-CCLM4-8-17_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_MOHC-HadGEM2-ES_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_MPI-M-MPI-ESM-LR_historical_r1i1p1_CLMcom-CCLM4-8-17_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_MPI-M-MPI-ESM-LR_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_NCC-NorESM1-M_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        'rsds_AFR-44_NOAA-GFDL-GFDL-ESM2M_historical_r1i1p1_SMHI-RCA4_v1_196001-200512.ymean.fldmean.nc',\
        ]

RCMsRCP85=[\
        'rsds_AFR-44_CCCma-CanESM2_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_CNRM-CERFACS-CNRM-CM5_rcp85_r1i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_CNRM-CERFACS-CNRM-CM5_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_CSIRO-QCCCE-CSIRO-Mk3-6-0_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r12i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r12i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r1i1p1_KNMI-RACMO22T_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_ICHEC-EC-EARTH_rcp85_r3i1p1_DMI-HIRHAM5_v2_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_IPSL-IPSL-CM5A-MR_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_MIROC-MIROC5_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_MOHC-HadGEM2-ES_rcp85_r1i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.ymean.fldmean.nc',\
        #'rsds_AFR-44_MOHC-HadGEM2-ES_rcp85_r1i1p1_KNMI-RACMO22T_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_MOHC-HadGEM2-ES_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_MPI-M-MPI-ESM-LR_rcp85_r1i1p1_CLMcom-CCLM4-8-17_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_MPI-M-MPI-ESM-LR_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_NCC-NorESM1-M_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        'rsds_AFR-44_NOAA-GFDL-GFDL-ESM2M_rcp85_r1i1p1_SMHI-RCA4_v1_mon_200601-210012.ymean.fldmean.nc',\
        ]
GCMsRCP85=[\
        'ACCESS1-0',\
        'ACCESS1-3',\
        'BNU-ESM',\
        'CCSM4',\
        'CESM1-BGC',\
        'CESM1-CAM5',\
        'CMCC-CESM',\
        'CMCC-CMS',\
        'CMCC-CM',\
        'CNRM-CM5',\
        'CSIRO-Mk3-6-0',\
        'CanESM2',\
        'EC-EARTH',\
        'FIO-ESM',\
        'GFDL-CM3',\
        'GFDL-ESM2G',\
        'GFDL-ESM2M',\
        'GISS-E2-H-CC',\
        'GISS-E2-H',\
        'GISS-E2-R-CC',\
        'GISS-E2-R',\
        'HadGEM2-AO',\
        'HadGEM2-ES',\
        'IPSL-CM5A-LR',\
        'IPSL-CM5A-LR',\
        'IPSL-CM5A-MR',\
        'IPSL-CM5B-LR',\
        'MIROC-ESM-CHEM',\
        'MIROC-ESM',\
        'MIROC5',\
        'MPI-ESM-LR',\
        'MPI-ESM-MR',\
        'MRI-CGCM3',\
        'NorESM1-ME',\
        'NorESM1-M',\
        'bcc-csm1-1',\
        'inmcm4',\
                ]


#================================================ CMIP5 models
# for historical
GCMsHist=[\
        'ACCESS1-0',\
        'ACCESS1-3',\
        'BNU-ESM',\
        'CCSM4',\
        'CESM1-BGC',\
        'CESM1-CAM5',\
        'CESM1-FASTCHEM',\
        'CESM1-WACCM',\
        'CMCC-CESM',\
        'CNRM-CM5',\
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


EnsembleHist=[\
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
        'r3i1p1',\
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
EnsembleRCP85=[\
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
        ]
#=================================================== define the Plot:

fig1=plt.figure(figsize=(16,9))
ax = fig1.add_subplot(111)
plt.xlabel('Year',fontsize=16)  
plt.ylabel('Surface Downwelling SW radiation change (W m-2)',fontsize=16)
plt.title("Surface Downwelling SW radiation change (W m-2) in AFRICA simulated by CMIP5 models",fontsize=18)
if ObsRef==1:
    plt.ylim(-60,60)
else:
    plt.ylim(-10,10)
plt.xlim(1960,2099)
plt.grid()

#plt.xticks(np.arange(1960, 2100+10, 20))
#plt.xticks(1960,1980,2000,2020,2040,2060,2080,2099)
plt.xticks([1960,1980,2000,2020,2040,2060,2080,2099])
plt.tick_params(axis='both', which='major', labelsize=14)
plt.tick_params(axis='both', which='minor', labelsize=14)

# vertical at 2005
plt.axvline(x=2005.5,linewidth=2, color='gray')
plt.axhline(y=0,linewidth=2, color='gray')



########################## for hist:
########################## for hist:

#============================ for CORDEX
#============================ for CORDEX
EXPERIMENT='CORDEX'

DirCordexHist='/Users/tang/climate/CORDEX/hist/AFRICA/'
YEAR=range(1960,2006)
SumTemp=np.zeros(len(YEAR))
K=0

print "========== for",EXPERIMENT," ==============="

for infile0 in RCMsHist:
    infile1=DirCordexHist+infile0
    K=K+1 # for average 
    print('the file is == ' +infile1)

    #open input files
    infile=IO.NetCDFFile(infile1,'r')

    # read the variable tas
    TAS=infile.variables[VARIABLE][:,:,:].copy()
    #print 'the variable tas ===============: ' 
    #print TAS

    # calculate the annual mean temp:
    #TEMP=range(0,Nmonth,12) 
    #for j in range(0,Nmonth,12):
        #TEMP[j/12]=np.mean(TAS[j:j+11][:][:])-AbsTemp

    print " temp ======================== absolut"

    TEMP=range(0,len(YEAR)) 
    for j in range(0,len(YEAR)):
        TEMP[j]=np.mean(TAS[j][:][:])
    #print TEMP


    if ObsRef==1:
        RefTemp=CERESmean
    else:
        # reference temp: mean of 2001-2005
        RefTemp=np.mean(TEMP[len(YEAR)-10+1:len(YEAR)])

        if K==1:
            ArrRefTemp=[RefTemp]
        else:
            ArrRefTemp=ArrRefTemp+[RefTemp]
            print 'ArrRefTemp ========== ',ArrRefTemp

    TEMP=[t-RefTemp for t in TEMP]
    #print " temp ======================== relative to mean of 1986-2005"
    #print TEMP

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
    print 'NO. of timesteps on TEMP:',len(TEMP)


     #plot only target models
    if  K in RCMsPlotIndex:
        plt.plot(YEAR,TEMP,\
                #linestyles[TargetModel.index(Model)],\
                color=COLORtar[RCMsPlotIndex.index(K)],linewidth=2)
        print "color is",COLORtar[RCMsPlotIndex.index(K)]
        print "k is in the RCMsPlotIndex"


#=================================================== for ensemble mean
AveTemp=[e/K for e in SumTemp]
ArrTemp=list(np.array(ArrTemp))
print 'shape of ArrTemp:',np.shape(ArrTemp)
StdTemp=np.std(np.array(ArrTemp),axis=0)
print 'shape of StdTemp:',np.shape(StdTemp)

print "ArrTemp ========================:"
#print ArrTemp

print "StdTemp ========================:"
#print StdTemp

# 5-95% range ( +-1.64 STD)
StdTemp1=[AveTemp[i]+StdTemp[i]*1.64 for i in range(0,len(StdTemp))]
StdTemp2=[AveTemp[i]-StdTemp[i]*1.64 for i in range(0,len(StdTemp))]

print "Model number for historical is :",K

print "models for historical:";print RCMsHist

plt.plot(YEAR,AveTemp,label=" CORDEX mean", color="blue",linewidth=4)
plt.plot(YEAR,StdTemp1,color="black",linewidth=0.1)
plt.plot(YEAR,StdTemp2,color="black",linewidth=0.1)
plt.fill_between(YEAR,StdTemp1,StdTemp2,color='blue',alpha=0.3)


if ObsRef==0:
# draw NO. of model used:
    plt.text(1980,-8,'CORDEX Hist model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )
else:
    plt.text(1980,-35,'CORDEX Hist model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )


#=================================================== for CORDEX RCP85
#=================================================== for CORDEX RCP85

DirCordexRcp85='/Users/tang/climate/CORDEX/rcp85/AFRICA/'
YEAR=range(2006,2101)
SumTemp=np.zeros(len(YEAR))
K=0

print "========== for",EXPERIMENT," ==============="

for infile0 in RCMsRCP85:
    infile1=DirCordexRcp85+infile0
    K=K+1 # for average 
    print('the file is == ' +infile1)

    #open input files
    infile=IO.NetCDFFile(infile1,'r')

    # read the variable tas
    TAS=infile.variables[VARIABLE][:,:,:].copy()
    #print 'the variable tas ===============: ' 
    #print TAS

    # calculate the annual mean temp:
    #TEMP=range(0,Nmonth,12) 
    #for j in range(0,Nmonth,12):
        #TEMP[j/12]=np.mean(TAS[j:j+11][:][:])-AbsTemp

    print " temp ======================== absolut"

    TEMP=range(0,len(YEAR)) 
    for j in range(0,len(YEAR)):
        TEMP[j]=np.mean(TAS[j][:][:])
    #print TEMP

    if ObsRef==1:
        RefTemp=CERESmean
    else:
        # reference temp: mean of 1996-2005
        # get the reftemp if the model has historical data here
        print 'ArrRefTemp in HIST ensembles:',np.shape(ArrRefTemp)
        print ArrRefTemp
        print 'model index in HIST: ',RCMsRCP85.index(infile0)
        RefTemp=ArrRefTemp[RCMsRCP85.index(infile0)]
        print 'RefTemp from HIST: ',RefTemp
    
    TEMP=[t-RefTemp for t in TEMP]
    #print " temp ======================== relative to mean of 1986-2005"
    #print TEMP

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
    print 'NO. of timesteps on TEMP:',len(TEMP)

    #plot only target models
    if  K in RCMsPlotIndex:
        plt.plot(YEAR,TEMP,label=RCMsPlotLabels[RCMsPlotIndex.index(K)],\
                #linestyles[TargetModel.index(Model)],\
                color=COLORtar[RCMsPlotIndex.index(K)],linewidth=2)
        print "color is",COLORtar[RCMsPlotIndex.index(K)]
        print "k is in the RCMsPlotIndex"

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

print "models for historical:";print RCMsRCP85


plt.plot(YEAR,AveTemp,color="blue",linewidth=4)
plt.plot(YEAR,StdTemp1,color="black",linewidth=0.1)
plt.plot(YEAR,StdTemp2,color="black",linewidth=0.1)
plt.fill_between(YEAR,StdTemp1,StdTemp2,color='blue',alpha=0.3)

if ObsRef==0:
# draw NO. of model used:
    plt.text(2030,-8,'CORDEX RCP8.5 model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )
else:
    plt.text(2030,-35,'CORDEX RCP8.5 model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )



#=================================================== for CMIP5 hist
#=================================================== for CMIP5 hist
#=================================================== for CMIP5 hist
#=================================================== for CMIP5 hist
#=================================================== for CMIP5 hist
#=================================================== for CMIP5 hist

DirCMIP5Hist='/Users/tang/climate/CMIP5/hist/AFRICA'
TAILhist='_196001-200512.ymean.fldmean.AFR.nc'
EXPERIMENT='historical'
YEAR=range(1960,2006)
SumTemp=np.zeros(len(YEAR))
K=0

print "========== for",EXPERIMENT," ==============="

for Model in GCMsHist:
    K=K+1 # for average 
    infile1=DirCMIP5Hist+'/'\
            +VARIABLE+'_'+PRODUCT+'_'+Model+'_'+EXPERIMENT+'_'+EnsembleHist[GCMsHist.index(Model)]+TAILhist
            #clt_Amon_MPI-ESM-LR_historical_r1i1p1_196001-200512.fldmean.AFR.nc
    print('the file is == ' +infile1)

    #open input files
    infile=IO.NetCDFFile(infile1,'r')

    # read the variable tas
    TAS=infile.variables[VARIABLE][:,:,:].copy()
    #print 'the variable tas ===============: ' 
    #print TAS

    # calculate the annual mean temp:
    #TEMP=range(0,Nmonth,12) 
    #for j in range(0,Nmonth,12):
        #TEMP[j/12]=np.mean(TAS[j:j+11][:][:])-AbsTemp

    print " temp ======================== absolut"

    TEMP=range(0,len(YEAR)) 
    for j in range(0,len(YEAR)):
        TEMP[j]=np.mean(TAS[j][:][:])
    #print TEMP

    if ObsRef==1:
        RefTemp=CERESmean
    else:
        # reference temp: mean of 1996-2005
        RefTemp=np.mean(TEMP[len(YEAR)-10+1:len(YEAR)])
        if K==1:
            ArrRefTemp=[RefTemp]
        else:
            ArrRefTemp=ArrRefTemp+[RefTemp]
            print 'ArrRefTemp ========== ',ArrRefTemp


    TEMP=[t-RefTemp for t in TEMP]
    #print " temp ======================== relative to mean of 1986-2005"
    #print TEMP

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
    print 'NO. of timesteps on TEMP:',len(TEMP)

    #plot only target models
    if  Model in TargetModel:
        plt.plot(YEAR,TEMP,\
                #linestyles[TargetModel.index(Model)],\
                color=GCMsCol[1],linewidth=4)
        print "color is",GCMsCol[0]

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

print "models for historical:";print  GCMsHist


plt.plot(YEAR,AveTemp,label=' CMIP5 mean',color="black",linewidth=4)
plt.plot(YEAR,StdTemp1,color="black",linewidth=0.1)
plt.plot(YEAR,StdTemp2,color="black",linewidth=0.1)
plt.fill_between(YEAR,StdTemp1,StdTemp2,color='black',alpha=0.3)


if ObsRef==0:
    # draw NO. of model used:
    plt.text(1980,-6,'CMIP5 Hist model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )
else:
    plt.text(1980,-30,'CMIP5 Hist model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )

#=================================================== for CMIP5 rcp8.5:
#=================================================== for CMIP5 rcp8.5:
#=================================================== for CMIP5 rcp8.5:
#=================================================== for CMIP5 rcp8.5:
#=================================================== for CMIP5 rcp8.5:


DirCMIP5RCP85='/Users/tang/climate/CMIP5/rcp85/AFRICA/'
EXPERIMENT='rcp85'
TailRcp85='_200601-210012.ymean.fldmean.AFR.nc'
YEAR=range(2006,2101)
Nmonth=1140
SumTemp=np.zeros(len(YEAR))
K=0

print "========== for",EXPERIMENT," ==============="

for Model in GCMsRCP85:
    K=K+1 # for average 
    infile1=DirCMIP5RCP85+'/'\
            +VARIABLE+'_'+PRODUCT+'_'+Model+'_'+EXPERIMENT+'_'+EnsembleRCP85[K-1]+TailRcp85
            #clt_Amon_MPI-ESM-LR_historical_r1i1p1_196001-200512.fldmean.AFR.nc
    print('the file is == ' +infile1)

    #open input files
    infile=IO.NetCDFFile(infile1,'r')

    # read the variable tas
    TAS=infile.variables[VARIABLE][:,:,:].copy()
    #print 'the variable tas ===============: ' 
    #print TAS

    # calculate the annual mean temp:
    #TEMP=range(0,Nmonth,12) 
    #for j in range(0,Nmonth,12):
        #TEMP[j/12]=np.mean(TAS[j:j+11][:][:])-AbsTemp


    TEMP=range(0,len(YEAR)) 
    for j in range(0,len(YEAR)):
        TEMP[j]=np.mean(TAS[j][:][:])

    print " temp ======================== absolut"
    print TEMP

    if ObsRef==1:
        RefTemp=CERESmean
    else:
        # reference temp: mean of 1996-2005

        # get the reftemp if the model has historical data here
        print 'ArrRefTemp in HIST ensembles:',np.shape(ArrRefTemp)
        print ArrRefTemp
        if Model in GCMsHist:
            print 'model index in HIST: ',GCMsHist.index(Model)
            print 'K=',K
            RefTemp=ArrRefTemp[GCMsHist.index(Model)]
            print 'RefTemp from HIST: ',RefTemp
        else:
            RefTemp=np.mean(TEMP[0:9])
            print 'RefTemp from RCP8.5: ',RefTemp
        


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
    print 'NO. of timesteps on TEMP:',len(TEMP)

    #plot only target models
    if  Model in TargetModel:
        plt.plot(YEAR,TEMP,label=Model,\
                #linestyles[TargetModel.index(Model)],\
                color=GCMsCol[1],linewidth=4)
        print "color is",GCMsCol[0]
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

print "models for historical:";print  GCMsHist


plt.plot(YEAR,AveTemp,color="black",linewidth=4)
plt.plot(YEAR,StdTemp1,color="black",linewidth=0.1)
plt.plot(YEAR,StdTemp2,color="black",linewidth=0.1)
plt.fill_between(YEAR,StdTemp1,StdTemp2,color='black',alpha=0.3)



if ObsRef==0:
    # draw NO. of model used:
    plt.text(2030,-6,'CMIP5 RCP8.5 model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )
else:
    plt.text(2030,-30,'CMIP5 RCP8.5 model: '+str(K),size=16,rotation=0.,
            ha="center",va="center",
            #bbox = dict(boxstyle="round",
            #ec=(1., 0.5, 0.5),
            #fc=(1., 0.8, 0.8),
            #))
            )


plt.legend(loc=2)

plt.show()
quit()

