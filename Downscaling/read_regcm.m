clear all, close all
%=================================================== 
OBS='MODIS'


DIR='/Users/tang/climate/CORDEX/'
VARIABLE='clt'
PRODUCT='Amon'
ENSEMBLE='r1i1p1'
EXPERIMENT='hist'
TIME='195001-200512'

%GCMs={'CNRM-CM5'; 'CanESM2'; 'CSIRO-Mk3-6-0'; 'GFDL-ESM2M';...
    %'HadGEM2-ES'; 'IPSL-CM5A-MR'; 'MIROC5'; 'MPI-ESM-LR'; 'NorESM1-M'}


DriModels={'CCCma-CanESM2'; 'CNRM-CERFACS-CNRM-CM5'; 'CNRM-CERFACS-CNRM-CM5';...
    'CSIRO-QCCCE-CSIRO-Mk3-6-0'; 'ICHEC-EC-EARTH'; 'ICHEC-EC-EARTH'; 'ICHEC-EC-EARTH';...
    'ICHEC-EC-EARTH'; 'IPSL-IPSL-CM5A-MR'; 'MIROC-MIROC5'; 'MOHC-HadGEM2-ES';...
    'MOHC-HadGEM2-ES'; 'MPI-M-MPI-ESM-LR'; 'MPI-M-MPI-ESM-LR'; 'NCC-NorESM1-M';...
    'NOAA-GFDL-GFDL-ESM2M'}

nameGCMs={'CanESM2'; 'CNRM-CM5'; 'CNRM-CM5'; 'CSIRO-Mk3-6-0'; 'EC-EARTH'; 'EC-EARTH';...
    'EC-EARTH'; 'EC-EARTH'; 'IPSL-CM5A-MR'; 'MIROC5'; 'HadGEM2-ES'; 'HadGEM2-ES';...
    'MPI-ESM-LR'; 'MPI-ESM-LR'; 'NorESM1-M'; 'GFDL-ESM2M'}

RCMs={'SMHI-RCA4_v1'; 'CLMcom-CCLM4-8-17_v1'; 'SMHI-RCA4_v1'; 'SMHI-RCA4_v1';...
    'CLMcom-CCLM4-8-17_v1'; 'KNMI-RACMO22T_v1'; 'DMI-HIRHAM5_v2'; 'SMHI-RCA4_v1';...
    'SMHI-RCA4_v1'; 'SMHI-RCA4_v1'; 'CLMcom-CCLM4-8-17_v1'; 'SMHI-RCA4_v1';...
    'CLMcom-CCLM4-8-17_v1'; 'SMHI-RCA4_v1'; 'SMHI-RCA4_v1'; 'SMHI-RCA4_v1'}

nameRCMs={'RCA4_v1'; 'CCLM4-8-17_v1'; 'RCA4_v1'; 'RCA4_v1'; 'CCLM4-8-17_v1';...
    'RACMO22T_v1'; 'HIRHAM5_v2'; 'RCA4_v1'; 'RCA4_v1'; 'RCA4_v1';...
    'CCLM4-8-17_v1'; 'RCA4_v1'; 'CCLM4-8-17_v1'; 'RCA4_v1'; 'RCA4_v1'; 'RCA4_v1'}

ENSEMBLE={'r1i1p1'; 'r1i1p1'; 'r1i1p1'; 'r1i1p1'; 'r12i1p1'; 'r1i1p1';...
    'r3i1p1'; 'r12i1p1'; 'r1i1p1'; 'r1i1p1'; 'r1i1p1'; 'r1i1p1'; 'r1i1p1';...
    'r1i1p1'; 'r1i1p1'; 'r1i1p1'}

GCMs={'CanESM2';'CNRM-CM5';...
    'CSIRO-Mk3-6-0';...
    'EC-EARTH';...
    'IPSL-CM5A-MR'; 'MIROC5';...
    'HadGEM2-ES';'MPI-ESM-LR';...
    'NorESM1-M'; 'GFDL-ESM2M'}
ENSEMBLE2={'r1i1p1'; 'r3i1p1'; 
    'r2i1p1';...
    'r2i1p1';...
    'r1i1p1'; 'r1i1p1';...
    'r2i1p1'; 'r1i1p1';...
    'r1i1p1'; 'r1i1p1'}
COLOR={'darkred','darkblue','darkgreen','deeppink',...
        'black','orangered','cyan','magenta'}




%=================================================== for OBS


switch OBS
	case 'CRU'
        obsVar='cld'
 obsPath='~/climate/GLOBALDATA/OBSDATA/CRU/3.22/cru_ts3.22.2001.2005.cld.dat.ymonmean.NDJFMA.nc';
	case 'MODIS'
        obsVar='clt'
 obsPath='~/climate/GLOBALDATA/OBSDATA/MODIS/clt_MODIS_L3_C5_200101-200512.ymonmean.NDJFMA.AFR.nc';
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


 indAX = find(AX >= -24.64 & AX <= 60.28);
 indAY = find(AY >= -45.76 & AY <= 42.24);
 obs_mm = obs_m(indAX,indAY);
 whos obs_mm
 
 %figure
 %pcolor(Y(indAX,indAY),X(indAX,indAY),obs_mm)

 BUOY1(1,:) = obs_mm(:);          % precip OBS reference
 whos BUOY1;



%=================================================== read RCMs
RCMs=cellstr([RCMs])

GCMdir='~/climate/CMIP5/hist/'
RCMdir='/Users/tang/climate/CORDEX/hist/'
tail='_mon_200101-200512.nc.summer.mean.nc.rempa.modis.nc' 

var='clt';

for k = 1:size(RCMs)   % number of model outputs

    RCMPath=strcat(RCMdir,char(DriModels(k)),'/clt_AFR-44_',char(DriModels(k)),'_historical_',...
       char(ENSEMBLE(k)),'_',char(RCMs(k)),tail)
    disp(RCMPath)

    get_info_nc = ncinfo(RCMPath);
    get_info_nc
    get_info_nc.Variables
    get_info_nc.Variables.Name % get the names of variables inside file

    Var = ncread(RCMPath,var);
    Var = double(Var);
    whos Var

    lon = ncread(RCMPath,'lon');
    lon = double(lon);
 
    lat = ncread(RCMPath,'lat');
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
 indAx = find(Ax >= -24.64 & Ax <= 60.28);
 indAy = find(Ay >= -45.76 & Ay <= 42.24);
 

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

%disp(quit)
%=================================================== read GCMs
GCMs=cellstr([GCMs])

GCMdir='/Users/tang/climate/CMIP5/hist/'
tail='_200101-200512.nc.summer.mean.nc.remap.modis.nc'

var='clt';

for k = 1:size(GCMs)   % number of model outputs

    GCMPath=strcat(GCMdir,char(GCMs(k)),'/clt_Amon_',char(GCMs(k)),'_historical_',...
       char(ENSEMBLE2(k)),tail)
    disp(GCMPath)
    %clt_Amon_CanESM2_historical_r1i1p1_200101-200512.nc.summer.mean.nc.remap.modis.nc

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
 
    %pcolor(Y,X,Var_m)
    shading interp

  % taking off buffer zone area
 
 Ax = Y(:,1);
 Ay = X(1,:);
 % AFRICA Domain: -24.64,60.28,-45.76,42.24
 indAx = find(Ax >= -24.64 & Ax <= 60.28);
 indAy = find(Ay >= -45.76 & Ay <= 42.24);
 

 whos Var_m
    BUOY1(k+17,:) = Var_m(:);    % precip
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


save GCM-RCM.mat BUOY1
