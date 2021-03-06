;**********************************
; taylor_4.ncl
;**********************************
load "$NCARG_ROOT/lib/ncarg/nclscripts/csm/gsn_code.ncl"   
load "$NCARG_ROOT/lib/ncarg/nclscripts/csm/gsn_csm.ncl"   
load "./taylor_diagram.ncl"
load "./taylor_metrics_table.ncl"
;**********************************
begin
;**********************************
; Assume the following have already been computed:
;   _ratio are the ratio:  Case_Variance/Reference_Variance
;   _cc    are the cross correlation coef of Case to Reference
; In this example, these are derived for annual mean climatologies.
;**********************************

; Cases [Model]
  case      = (/ "GFDL-ESM2M", "GFDL-ESM2M + RegCM4" /) 
  nCase     = dimsizes(case )                 ; # of Cases [Cases]

; variables compared
  var       = (/ "tas","pr" ,"rsds", "clt" /)
  nVar      = dimsizes(var)                   ; # of Variables

; more info to be added [all are bogus]
  source    = (/ "CRU","CPGP", "CERES", "MODIS"/)

; "GCMs"                        
  CA_ratio   = (/1.1, 1.13, 0.89, 0.71 /)

  CA_cc      = (/0.76, 0.86, 0.6, 0.4 /)

; "RegCM" 
  CB_ratio   = (/ 1.21, 1.5, 0.89, 0.56 /)

  CB_cc      = (/0.86, 0.71, 0.41, 0.1 /)

; arrays to be passed to taylor_diagram. It will calculate the x xnd y coordinates.
  ratio      = new ((/nCase, nVar/),typeof(CA_cc) )  
  cc         = new ((/nCase, nVar/),typeof(CB_cc) ) 

  ratio(0,:) = CA_ratio 
  ratio(1,:) = CB_ratio

  cc(0,:)    = CA_cc 
  cc(1,:)    = CB_cc

;**********************************
; create plot
;**********************************
  varSource = var +" vs "+ source              ; add extra info [*not* required]

  ty_opt   = True                           ; taylor diagram with options
        
  ty_opt@Markers       = (/16, 16/)         ; make all solid fill
  ty_opt@Colors        = (/"blue", "red" /)          
  ty_opt@varLabels     = varSource
  ty_opt@caseLabels    = case

  ty_opt@varLabelsYloc = 1.3                ; Move location of variable labels [default 0.45]
  ty_opt@caseLabelsFontHeightF = 0.68       ; make slight larger   [default=0.12 ]
  ty_opt@varLabelsFontHeightF  = 0.014      ; make slight smaller  [default=0.013]
 
  ty_opt@tiMainString  = ""           ; title
  ty_opt@stnRad        = (/ 0.5, 1.5 /)     ; additional standard radii
  ty_opt@ccRays        = (/ 0.6, 0.9 /)     ; correllation rays
  ty_opt@centerDiffRMS = True               ; RMS 'circles'

  wks   = gsn_open_wks("ps","taylor")
  plot  = taylor_diagram(wks,ratio,cc,ty_opt)

;**************************************************
; fill an array for a "taylor metrics table"
;**************************************************

  season    = (/ "title" /)
  nSeason   = dimsizes(season)

  table     = new ( (/nCase,nSeason,nVar/), typeof(ratio) )
  table(0,0,:) = CA_ratio
  table(1,0,:) = CB_ratio

  tt_opt        = True
  tt_opt@pltType= "ps"                  ; "eps" [default], "pdf", "ps"
                                         ; "png", "gif" [if you have ImageMajik 'convert']


  taylor_metrics_table("metrics", varSource, case ,season, table, tt_opt)
end 
