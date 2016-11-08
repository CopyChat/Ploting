from Scientific.IO.NetCDF import NetCDFFile
import matplotlib.pyplot as plt

f = NetCDFFile('scientificio.nc')
fig = plt.figure()
ax = fig.add_subplot(111)
ax.plot(f.variables['time'])
plt.show()
