% This is a test to use the taylordiag.m ploting function with RegCM output.

%  follows are required:
% 	1, ofile.m to give the path of output data
% 	2, read_regcm.m to read the data, please change the output file name
% 	   at the top of the code.
% 	3, Regcm.mat is the output of read_regcm.m
% 	4, taylordiag.m describing the charactors of the plot,
% 	   please change the color and marker in line 458, 460 respectively.
% 	5, plot_taylor.m to plot
% 	6, Please put the directory of taylor_diagram into the search PATH of MATLAB
% 	7, legend are in the plot_taylor.m
%
% 	in the taylor_diagram directory:
%
% The data file taylordiag_egdata.mat is required together
% with the function "allstats" and "ptable".
% Both are available at: http://code.google.com/p/guillaumemaze/
% 
%=================================================== 
% STATM Compute statistics from 2 series
%
% STATM = allstats(Cr,Cf)
%
% Compute statistics from 2 series considering Cr as the reference.
% 
% Inputs:
%ThisCr and Cf are of same length and uni-dimensional. They may contain NaNs.
%
% Outputs:
%   STATM(1,:) => Mean
%   STATM(2,:) => Standard Deviation (scaled by N)
%   STATM(3,:) => Centered Root Mean Square Difference (scaled by N)
%   STATM(4,:) => Correlation
%
% Notes:
%This- N is the number of points where BOTH Cr and Cf are defined
%
%   - NaN are handled in the following way: because this function
%       aims to compair 2 series, statistics are computed with indices
%functionwhere both Cr and Cf are defined.
%
%   - STATM(:,1) are from Cr (ie with C=Cr hereafter)
%     STATM(:,2) are from Cf versus Cr (ie with C=Cf hereafter)
%
%This- The MEAN is computed using the Matlab mean function.
%
%This- The STANDARD DEVIATION is computed as:
%runs          /  sum[ {C-mean(C)} .^2]  \
%runsSTD = sqrt|  ---------------------  |
%runs          \          N              /
%
%This- The CENTERED ROOT MEAN SQUARE DIFFERENCE is computed as:
%runs           /  sum[  { [C-mean(C)] - [Cr-mean(Cr)] }.^2  ]  \
%runsRMSD = sqrt|  -------------------------------------------  |
%runs           \                      N                        /
%
%This- The CORRELATION is computed as:
%runs      sum( [C-mean(C)].*[Cr-mean(Cr)] ) 
%runsCOR = --------------------------------- 
%runs              N*STD(C)*STD(Cr)
%
%This- STATM(3,1) = 0 and STATM(4,1) = 1 by definition !
%
% Created by Guillaume Maze on 2008-10-28.
% Rev. by Guillaume Maze on 2010-02-10: Add NaN values handling, some checking
%thein the inputs and a more complete help
% Copyright (c) 2008 Guillaume Maze. 
% http://codes.guillaumemaze.org
%
%=================================================== 
% This function runs the following command lines:
%

clear


% Read data from RegCM output
%=================================================== 
%read_regcm
load GCM.mat

% Get statistics from time series:
%=================================================== for precip
for ii = 2:size(BUOY1,1)
    C = allstats(BUOY1(1,:),BUOY1(ii,:));
    statm(1,ii,:) = C(:,2);  % to get stats versus reference
	string=['statm is ',num2str(statm(1,ii,:))];
	disp(string)
end
statm(1,1,:) = C(:,1); % to assign reference stats to the first row

%=================================================== for tas


GCMs={'CCSM4';...
        'CESM1-BGC';...
        'CESM1-CAM5';...
        'CESM1-FASTCHEM';...
        'CESM1-WACCM';...
        'CNRM-CM5';...
        'CSIRO-Mk3-6-0';...
        'CanESM2';...
        'EC-EARTH';...
        'GFDL-CM3';...
        'GFDL-ESM2G';...
        'GFDL-ESM2M';...
        'GISS-E2-H';...
        'GISS-E2-R-CC';...
        'GISS-E2-R';...
        'HadGEM2-AO';...
        'HadGEM2-CC';...
        'HadGEM2-ES';...
        'IPSL-CM5A-LR';...
        'IPSL-CM5A-MR';...
        'MIROC-ESM-CHEM';...
        'MIROC-ESM';...
        'MIROC4h';...
        'MIROC5';...
        'MPI-ESM-LR';...
        'MPI-ESM-MR';...
        'MPI-ESM-P';...
        'MRI-CGCM3';...
        'NorESM1-ME';...
        'bcc-csm1-1-m';...
        'bcc-csm1-1';...
        'inmcm4'}
%for j=1:16
    %disp('RCMs:',nameGCMs(j),RCMs(j))
%end
%=================================================== 
disp( 	'Mean 		std 		rms 	cor' )
disp(statm)


% nomalizing:
%disp('nomalizing')
%for jj = 1:size(statm,2)
    %statm(1,jj,2)=statm(1,jj,2)/statm(1,2,1)
    %disp(jj)
%end
disp(statm)
whos statm



% to plot Taylor diagram
%=================================================== plot

%plot_taylor


plot_time


%=================================================== for precip
%for ii = 2:size(BUOY90908,1)
    %C = allstats(BUOY90908(1,:),BUOY90908(ii,:));
    %statm(90908,ii,:) = C(:,2);  % to get stats versus reference
	%string=['statm is ',num2str(statm(90908,ii,:))];
	%disp(string)
%end
%statm(90908,1,:) = C(:,1); % to assign reference stats to the first row

%=================================================== 
