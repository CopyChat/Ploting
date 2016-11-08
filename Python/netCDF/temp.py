#!/usr/bin/env python
########################################
#Globale Map tests
########################################
import numpy as np
from mpl_toolkits.axes_grid1 import ImageGrid
import math
from netCDF4 import Dataset, date2index
import pylab as pl
import Scientific.IO.NetCDF as sion
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
from mpl_toolkits.basemap import Basemap , addcyclic
from matplotlib.colors import LinearSegmentedColormap
from matplotlib import colors as c
import textwrap
import os

pl.close('all')
##########################

# command line 
if len(os.sys.argv) != 3:
	print("command inputfile Month (1 ~12),please ")
	exit()

nol= 18 # number of levels for ploting
ifile2=os.sys.argv[1] # model output file
#ifile2='/Users/tang/solar_energy/Modeling/test/output/SWIO_1_ATM.1979010100.nc' 
month = os.sys.argv[2]
timestep= int(month)-1
monname=["January","February","March","April","May","June",
	"July","August","September","October","November","December"]
timestamp = monname[timestep]

ifile1='/Users/tang/solar_energy/GLOBALDATA/OBSDATA/air.ymon.mean.nc' # obs

#exit()

#input files
nc_file1=sion.NetCDFFile(ifile1,'r')
nc_file2=sion.NetCDFFile(ifile2,'r')

#deciding on date to be plotted
ts1=nc_file1.variables['air'][timestep,:,:].squeeze()
ts2=nc_file2.variables['tas'][timestep,:,:].squeeze()

lat = nc_file1.variables['lat'][:]
lon = nc_file1.variables['lon'][:]
x,y=np.meshgrid(lon,lat)

lat2 = nc_file2.variables['xlat'][:]
lon2 = nc_file2.variables['xlon'][:]
x2,y2=np.meshgrid(lon2,lat2)

####################################################
# calculate the temperature get the values of global variables
offset1=getattr(nc_file1.variables['air'],'add_offset')
sf1=getattr(nc_file1.variables['air'],'scale_factor')
missing1=getattr(nc_file1.variables['air'],'missing_value')
#print missing

ts1_m = np.ma.masked_where(ts1==missing1, ts1)
ts1=ts1_m*sf1+offset1

print "================="
print ts1

offset2=getattr(nc_file2.variables['tas'],'add_offset')
sf2=getattr(nc_file2.variables['tas'],'scale_factor')
#missing2=getattr(nc_file2.variables['tas'],'missing_value')
##print missing

#ts2_m = np.ma.masked_where(ts2==missing, ts2)
ts2=ts2*sf2+offset2
print "================="
print ts2
#exit()

#for output
ofile1='ts'+'.'+month+'.png'
print('save as: '+ofile1)
#exit()

####################################################
############# plot ################################

fig=plt.figure(figsize=(10,10))
ax = fig.add_subplot(311) #obs
#ax=fig.add_axes([0.1,0.01,0.8,0.8])
#ax = fig1.add_axes([0.09, 0.1, 0.93, 0.82], axisbg = 'gray')
map=Basemap(projection='cyl',llcrnrlat=-40,urcrnrlat=0,\
         llcrnrlon=0,urcrnrlon=100,resolution='l')
map.drawcoastlines(linewidth=0.35)
map.drawparallels(np.arange(-90.,91.,15.),labels=[1,0,0,0],linewidth=0.35)
map.drawmeridians(np.arange(-180.,181.,20.),labels=[0,0,0,1],linewidth=0.35)
map.drawmapboundary(fill_color='0.3')

cmap1=plt.get_cmap('jet',nol)
#cMap = c.ListedColormap(['k','w','r','g','y','b','m'])
vmax= max(np.max(ts1),np.max(ts2))
vmin= min(np.min(ts1),np.min(ts2))
vmin=273.15

print vmax
print vmin
print "================"

pic1=map.pcolormesh(lon,lat,ts1,cmap=cmap1,vmax=vmax,vmin=vmin)
norm = mpl.colors.Normalize(vmax=vmax, vmin=vmin)
plt.figtext(0.68,0.83,timestamp, size="large")
ax.set_title("Montly mean surface temperature (K)")

#=================================================== 

plt.savefig(ofile1)

ax1 = fig.add_subplot(312)
map1=Basemap(projection='cyl',llcrnrlat=-40,urcrnrlat=0,\
         llcrnrlon=0,urcrnrlon=100,resolution='l')
map1.drawcoastlines(linewidth=0.35)
map1.drawparallels(np.arange(-90.,91.,15.),labels=[1,0,0,0],linewidth=0.35)
map1.drawmeridians(np.arange(-180.,181.,20.),labels=[0,0,0,1],linewidth=0.35)
map1.drawmapboundary(fill_color='0.3')

pic2=map1.pcolormesh(lon2,lat2,ts2,cmap=cmap1,vmax=vmax,vmin=vmin )

#plt.title("\n".join(textwrap.wrap(title1,55)))
plt.figtext(0.68,0.58,timestamp, size="large")


#ax3 = fig.add_axes(location="top")
ax3 = fig.add_axes([0.2, .3, .6, 0.2])
ax3.axis('off')
cbar = plt.colorbar(orientation='horizontal')
cbar.set_label('K')

plt.savefig(ofile1)
#plt.show()
