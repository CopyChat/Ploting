


import matplotlib.pyplot as plt
from scipy.io import netcdf

f = netcdf.netcdf_file('SWIO_ATM.2001030100.nc', 'r')
print f.history
time = f.variables['time']
ps = f.variables['ps']
print ps[:]
print time.units
print time.shape
print time[:]



f.close()

