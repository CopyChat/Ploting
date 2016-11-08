% This is a test to use the taylordiag.m ploting function.
%
% The data file taylordiag_egdata.mat is required together
% with the function "allstats" and "ptable".
% Both are available at: http://code.google.com/p/guillaumemaze/
% 
%
% This function runs the following command lines:

%=================================================== plot
figure
iw=2;jw=2;
alphab = 'OABCDEFGHIJKLMNOPQRSTUVWXYZ';

%subplot(iw,jw,1); 
%plot(BUOY1');
%grid on,xlabel('grid points');ylabel('precipitation (mm/day)');
%title(sprintf('%s:  precipitation (mm/day)','A'),'fontweight','bold');
%legend('OBS','Etest0001','Etest001','Etest01','Etest05','CMIP\_Etest001','CMIP\_Etest01','CMIP\_Etest05','CMIP\_Etest07','CMIP\_Etest1','EGtest0001','EGtest001','CMIP\_EGtest07','CMIP\_EGtest1')

%subplot(iw,jw,1); 
hold on
[pp tt axl] = taylordiag(squeeze(statm(1,:,2)),squeeze(statm(1,:,3)),squeeze(statm(1,:,4)),...
            'tickRMS',[5:5:20],'titleRMS',1,'tickRMSangle',145,'showlabelsRMS',1,'widthRMS',1,...
            'tickSTD',[0:5:25],'limSTD',25,'titleSTD',16,'showlabelsstd',10,...
            'tickCOR',[.1:.1:.9 .95 .99],'showlabelsCOR',1,'titleCOR',1);
% 	pp: returns handles of plotted points
%	tt: returns handles of the text legend of points
%	axl: returns a structure of handles of axis labels

legend('','','MODIS','a: CanESM2+RCA4', 'b: CNRM-CM5+CCLM4', 'c: CNRM-CM5+RCA4', 'd: CSIRO-Mk3-6-0+RCA4',...
    'e: EC-EARTH+CCLM4', 'f:  EC-EARTH+RACMO22T', 'g:  EC-EARTH+HIRHAM5', 'h: EC-EARTH+RCA4',...
    'i: IPSL-CM5A-MR+RCA4', 'j: MIROC5+RCA4', 'k: HadGEM2+CCLM4', 'l: HadGEM2+RCA4',...
    'm: MPI-ESM-LR+CCLM4', 'n: MPI-ESM-LR+RCA4', 'o: NorESM1-M+RCA4', 'p: GFDL-ESM2M+RCA4',...
    'q: CanESM2','r: CNRM-CM5',...
    's: CSIRO-MRk3-6-0','t: EC-EARTH',...
    'u: IPSL-CM5A-MR', 'v: MIROC5',...
    'w: HadGEM2-ES','x: MPI-ESM-LR',...
    'y: NorESM1-M', 'z: GFDL-ESM2M')

for ii = 1 : length(tt)
    set(tt(ii),'fontsize',14,'fontweight','bold')
    set(pp(ii),'markersize',8)
    if ii == 1 
        set(tt(ii),'String','MODIS');
    end
	%if ii == 2
		%set(tt(ii),'String','EIN15');
		%%set(tt(ii),'String',alphab(ii-1));
	%end
	%if ii == 3
		%set(tt(ii),'String','CMIP5');
		%%set(tt(ii),'String',alphab(ii-1));
	%end
end
title(sprintf('%s: RCMs and GCMs simulated Total Cloud Cover vs MODIS' ,'A'),'fontweight','bold');
%legend('','','OBS','Etest0001','Etest001','Etest01','Etest05','CMIP\_Etest001','CMIP\_Etest01','CMIP\_Etest05','CMIP\_Etest07','CMIP\_Etest1','EGtest0001','EGtest001','CMIP\_EGtest07','CMIP\_EGtest1')
%legend('','','OBS','EGtest0001','CMIP\_Etest1')


tt = axl(2).handle;
for ii = 1 : length(tt)
    set(tt(ii),'fontsize',12,'fontweight','normal');
end
set(axl(1).handle,'fontweight','normal');

%=====================================================================================
%================ tas  =========================================================
%=====================================================================================
%subplot(iw,jw,2); 
%plot(BUOY2');
%grid on,xlabel('grid points ');ylabel('surface temperature (K)');
%title(sprintf('%s: surface temperature (K)','C'),'fontweight','bold');
%legend('OBS','Etest0001','Etest001','Etest01','Etest05','CMIP\_Etest001','CMIP\_Etest01','CMIP\_Etest05','CMIP\_Etest07','CMIP\_Etest1','EGtest0001','EGtest001','CMIP\_EGtest07','CMIP\_EGtest1')

%=================================================== 
%=====================================================================================
