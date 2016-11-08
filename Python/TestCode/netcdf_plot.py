#!/usr/local/bin python

from Scientific.IO.NetCDF import NetCDFFile
import matplotlib.pyplot as plt
from numpy import * 

f = NetCDFFile('SWIO_ATM.2001030100.nc')
fig = plt.figure()
ax = fig.add_subplot(323)
ax.plot(f.variables['time'])
plt.show()
