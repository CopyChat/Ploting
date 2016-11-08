clear all, close all
%=================================================== 
OBS='MODIS'


DIR='/Users/tang/climate/CMIP5/hist/SWIO'
ENSEMBLE='r1i1p1'
VARIABLE='clt'
PRODUCT='Amon'
ENSEMBLE='r1i1p1'
EXPERIMENT='hist'
TIME='195001-200512'

%GCMs={'CNRM-CM5'; 'CanESM2'; 'CSIRO-Mk3-6-0'; 'GFDL-ESM2M';...
    %'HadGEM2-ES'; 'IPSL-CM5A-MR'; 'MIROC5'; 'MPI-ESM-LR'; 'NorESM1-M'}


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


COLOR={'darkred','darkblue','darkgreen','deeppink',...
        'black','orangered','cyan','magenta'}




%=================================================== for OBS


switch OBS
	case 'CRU'
        obsVar='cld'
 obsPath='~/climate/GLOBALDATA/OBSDATA/CRU/3.22/cru_ts3.22.2001.2005.cld.dat.ymonmean.NDJFMA.nc';
	case 'MODIS'
        obsVar='clt'
 obsPath='~/climate/GLOBALDATA/OBSDATA/MODIS/clt_MODIS_L3_C5_200101-200512.ymonmean.NDJFMA.SWIO.nc';
end % switch

%RegCM=cellstr([EG]) 				% 

%=================================================== read OBS

 get_info_nc = ncinfo(obsPath);
 get_info_nc
 
 get_info_nc.Variables
 get_info_nc.Variables.Name 

 obs = ncread(obsPath,obsVar);
 obs = double(obs);
 whos obs

 
 lon = ncread(obsPath,'lon');
 lon = double(lon);
 
 lat = ncread(obsPath,'lat');
 lat = double(lat);

 [X,Y] = meshgrid(lat,lon);
 obs_m = mean(obs,3);

 disp('iiiiiiiiiiiiiiiiiiii')
 %disp(X)
 %disp(Y)
 whos X
 whos Y
 whos obs_m

 %figure
 pcolor(Y,X,obs_m)
 shading interp

% taking off buffer zone area
 
 AX = Y(:,1);
 AY = X(1,:);

 %disp(AX)
 %disp(AY)
 whos AX
 whos AY


 indAX = find(AX >= 0 & AX <= 100);
 indAY = find(AY >= -40 & AY <= 0);
 obs_mm = obs_m(indAX,indAY);
 whos obs_mm
 
 %figure
 %pcolor(Y(indAX,indAY),X(indAX,indAY),obs_mm)

 BUOY1(1,:) = obs_mm(:);          % precip OBS reference
 whos BUOY1;



%=================================================== read GCMs
GCMs=cellstr([GCMs])

DIR='~/climate/CMIP5/hist/SWIO'
tail='_200101-200512.winter.remap.modis.SWIO.nc'
%tail='_200101-200512.summer.remap.modis.SWIO.nc'

var='clt';

for k = 1:size(GCMs)   % number of model outputs

%clt_Amon_HadGEM2-AO_historical_r1i1p1_200101-200512.winter.remap.modis.SWIO.nc
    GCMPath=strcat(DIR,'/clt_Amon_',char(GCMs(k)),...
       '_historical_',ENSEMBLE,tail)
    disp(GCMPath)


    get_info_nc = ncinfo(GCMPath);
    get_info_nc
    get_info_nc.Variables
    get_info_nc.Variables.Name % get the names of variables inside file

    Var = ncread(GCMPath,var);
    Var = double(Var);
    whos Var

    lon = ncread(GCMPath,'lon');
    lon = double(lon);
 
    lat = ncread(GCMPath,'lat');
    lat = double(lat);
 
    [X,Y] = meshgrid(lat,lon);

    Var_m = mean(Var,3)
    whos Var_m
 
    %figure

    whos lon
    whos lat
 
    pcolor(Y,X,Var_m)
    shading interp

  % taking off buffer zone area
 
 Ax = Y(:,1);
 Ay = X(1,:);
 % AFRICA Domain: -24.64,60.28,-45.76,42.24
 indAX = find(Ax >= 0 & Ax <= 100);
 indAY = find(Ay >= -40 & Ay <= 0);
 

 whos Var_m
    BUOY1(k+1,:) = Var_m(:);    % precip
    whos BUOY1;
    %case 2
     %BUOY2(j+1,:) = Exp_grid(:);    % t.2m
    %case 3
     %BUOY3(j+1,:) = Exp_grid(:);    % dswrs
    %case 4
     %BUOY4(j+1,:) = Exp_grid(:);    % dlwrs
%end % switch
%%=================================================== output
disp(k)
end

whos BUOY1
%whos BUOY2
%whos BUOY3
%whos BUOY4


save GCM.mat BUOY1
