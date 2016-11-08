## ---------------------------------------------------------------------------
## This software is in the public domain, furnished "as is", without technical
## support, and with no warranty, express or implied, as to its usefulness for
## any purpose.
## ---------------------------------------------------------------------------
## http://gfesuite.noaa.gov/developer/netCDFPythonInterface.html
## ---------------------------------------------------------------------------
##
## This is a python program that illustrates how to create, modify,
## and read netCDF variables, dimensions and attribtes using the
## python interface to netCDF.
## ---------------------------------------------------------------------------

## Import the necessary Numeric and netCDF modules
from Scientific.IO.NetCDF import NetCDFFile
from numpy import *

## Open the file
file = NetCDFFile('testFile.nc', 'w')
file2 = NetCDFFile('SWIO_ATM.2001030100.nc', 'r')

## Create some global attribute using a constant
setattr(file, 'versionNumber', 'kk')

## Create a global attribute using a variable 
magicNum = 42
setattr(file, 'magicNumber', magicNum)

## Get the value of these global variables
val1 = getattr(file, 'versionNumber')
val2 = getattr(file, 'magicNumber')
print "global value:"
print "versionNumber =", val1, "\n" "magicNumber =", val2


val11 = getattr(file2, 'source')
val22 = getattr(file2, 'title')
print "global value:"
print "versionNumber =", val11, "\n" "magicNumber =", val22

## Make some dimensions
file.createDimension('smallDim', 4)
file.createDimension('mediumDim', 25)
file.createDimension('largeDim', 100)

## Make a new variable
varDims = ('smallDim', 'mediumDim')
var1 = file.createVariable('varOne', 'i', varDims)

## Get the size of a variable
var1Shape = var1.shape
print "The size of varOne is:", var1Shape

## Put some data in the variable
for i in arange(var1Shape[0]):
    for j in arange(var1Shape[1]):
        var1[i, j] = i * j

#Make another variable
varDims = ('mediumDim', 'largeDim')
file.createVariable('varTwo', 'f', ('mediumDim', 'largeDim'))

## Get the new variable (could have done this when we created var2)
var2 = file.variables['varTwo']
var22 = file2.variables['time']

## Initialize the new variable to 0.0
for i in arange(var2.shape[0]):
    for j in arange(var2.shape[1]):
        var2[i, j] = 0.0

## Get the data from first variable
data = var1.getValue()
data2 = var22.getValue()

## Print out the data
print data
print data2 

## Get the dimension names of var1
dimNames = var1.dimensions
print "Dimension names of var1:", dimNames

## Create some attributes for var1
setattr(var1, 'units', 'Degrees C')
setattr(var1, 'precision', 2)
setattr(var1, 'maxValue', 19.999)

## Read the variable attributes we just created
att1 = getattr(var1, 'units')
att2 = getattr(var1, 'precision')
att3 = getattr(var1, 'maxValue')

## Print the value of these variable attributes
print "units =", att1, 'precision = ', att2, 'maxValue = ', att3

## Close the netCDF file
file.close()



