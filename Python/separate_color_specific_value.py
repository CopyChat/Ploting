import numpy as np
import matplotlib as mpl
from matplotlib import pyplot as plt

N = 10

np.random.seed(10)    
a=np.random.randint(-1, N, size=(5, 5))
print a

fig, ax = plt.subplots()

colors = [(0.0,0.0,0.0),(1.0,1.0,1.0)]
colors.extend(mpl.cm.jet(np.linspace(0, 1, N-1)))
cmap = mpl.colors.ListedColormap(colors)
mat=ax.matshow(a, cmap=cmap, vmin=-1, vmax=N-1)
cax = plt.colorbar(mat, ticks=np.linspace(-0.5, N-1-0.5, N+1))
cax.set_ticklabels(range(-1, N))
plt.show()
