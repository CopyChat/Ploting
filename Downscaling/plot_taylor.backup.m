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
alphab = 'ABCDEFGHIJKLMNOPQ';

%subplot(iw,jw,1); 
%plot(BUOY1');
%grid on,xlabel('grid points');ylabel('precipitation (mm/day)');
%title(sprintf('%s:  precipitation (mm/day)','A'),'fontweight','bold');
%legend('OBS','Etest0001','Etest001','Etest01','Etest05','CMIP\_Etest001','CMIP\_Etest01','CMIP\_Etest05','CMIP\_Etest07','CMIP\_Etest1','EGtest0001','EGtest001','CMIP\_EGtest07','CMIP\_EGtest1')

subplot(iw,jw,1); 
hold on
[pp tt axl] = taylordiag(squeeze(statm(1,:,2)),squeeze(statm(1,:,3)),squeeze(statm(1,:,4)),...
            'tickRMS',[.5:.5:2],'titleRMS',1,'tickRMSangle',125,'showlabelsRMS',1,'widthRMS',.8,...
            'tickSTD',[1:0.5:2],'limSTD',2,'titleSTD',1,...
            'tickCOR',[.1:.1:.9 .95 .99],'showlabelsCOR',1,'titleCOR',1);
% 	pp: returns handles of plotted points
%	tt: returns handles of the text legend of points
%	axl: returns a structure of handles of axis labels

for ii = 1 : length(tt)
    set(tt(ii),'fontsize',9,'fontweight','bold')
    set(pp(ii),'markersize',12)
    if ii == 1
        set(tt(ii),'String','OBS');
    else
        set(tt(ii),'String',alphab(ii-1));
    end
end
title(sprintf('%s: RegCM vs OBS (precip)','B'),'fontweight','bold');
legend('','','OBS','Etest0001','Etest001','Etest01','Etest05','CMIP\_Etest001','CMIP\_Etest01','CMIP\_Etest05','CMIP\_Etest07','CMIP\_Etest1','EGtest0001','EGtest001','CMIP\_EGtest07','CMIP\_EGtest1')

tt = axl(2).handle;
for ii = 1 : length(tt)
    set(tt(ii),'fontsize',12,'fontweight','normal');
end
set(axl(1).handle,'fontweight','normal');

%=====================================================================================
%=====================================================================================
%=====================================================================================
%subplot(iw,jw,2); 
%plot(BUOY2');
%grid on,xlabel('grid points ');ylabel('surface temperature (K)');
%title(sprintf('%s: surface temperature (K)','C'),'fontweight','bold');
%legend('OBS','Etest0001','Etest001','Etest01','Etest05','CMIP\_Etest001','CMIP\_Etest01','CMIP\_Etest05','CMIP\_Etest07','CMIP\_Etest1','EGtest0001','EGtest001','CMIP\_EGtest07','CMIP\_EGtest1')

%=================================================== 
subplot(iw,jw,4); 
hold on
            %'tickRMS',[0.1:2.2],'titleRMS',1,'tickRMSangle',0,'showlabelsRMS',1,'widthRMS',1,...
[pp tt axl] = taylordiag(squeeze(statm(2,:,2)),squeeze(statm(2,:,3)),squeeze(statm(2,:,4)),...
            'tickRMS',[0.5:.5:3],'titleRMS',1,'tickRMSangle',135,'showlabelsRMS',1,'widthRMS',.8,...
            'tickSTD',[1:.5:3.5],'limSTD',3.5,'titleSTD',1,...
            'tickCOR',[.1:.1:.9 .95 .99],'showlabelsCOR',1,'titleCOR',1);
% 	pp: returns handles of plotted points
%	tt: returns handles of the text legend of points
%	axl: returns a structure of handles of axis labels

for ii = 1 : length(tt)
	set(tt(ii),'fontsize',9,'fontweight','bold')
	set(pp(ii),'markersize',12)
	if ii == 1
		set(tt(ii),'String','OBS');
	else
		set(tt(ii),'String',alphab(ii-1));
	end
end
title(sprintf('%s: RegCM vs OBS (surface temperature)','D'),'fontweight','bold');
legend('','','OBS','Etest0001','Etest001','Etest01','Etest05','CMIP\_Etest001','CMIP\_Etest01','CMIP\_Etest05','CMIP\_Etest07','CMIP\_Etest1','EGtest0001','EGtest001','CMIP\_EGtest07','CMIP\_EGtest1')

tt = axl(2).handle;
for ii = 1 : length(tt)
	set(tt(ii),'fontsize',12,'fontweight','normal');
end
set(axl(1).handle,'fontweight','normal');
%=====================================================================================
