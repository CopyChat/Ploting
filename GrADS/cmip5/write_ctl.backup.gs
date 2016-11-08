* write_ctl.gs
*
* Creates PDEF files and full descriptors for CMIP5 data on non-rectilinear grids
*
*
* Input arg is a filename that contains a list of datasets to describe 
* The format of the input file is expected to have the following syntax:
*     experiment/realm/frequency/MIP/variable/institute.model/ensemble
*     e.g.  
*     decadal1960/atmos/day/day/huss/MOHC.HadCM3/r10i2p1
*     decadal1960/atmos/day/day/pr/MOHC.HadCM3/r10i2p1
*     decadal1960/atmos/day/day/psl/MOHC.HadCM3/r10i2p1
*
* It is assumed that each entry in the input file is a directory 
* that contains the data files, or else symlinks to the data files. 
* The path prefix for the directories in the input file is "/data/cmip5/data/".
*
* The files created by this script will have the following syntax:
*   /data/cmip5/ctl/experiment/realm/frequency/MIP/variable/variable_institute.model_ensemble.ctl
*
* Calls external utilities: ncdump, ncks, RegridWeightGen, weights2pdef, get_calendar.sh, wordof, isfile.sh
* Needs external files: dummy_365day.ctl, dummy_day.ctl, dummy_mon.ctl, dummy_stub.ctl, linear0p5.nc



function main(arg)
datalist=subwrd(arg,1)
if (datalist='')
 say 'Usage: write_ctl <datalist>'
 return
endif

verb=0
_mons='jan feb mar apr may jun jul aug sep oct nov dec'
_script_path='/Users/tang/GrADS/cmip5/'

* Read the datasets from the datalist
while (1)
* reset the ctl flag
  write_ctl = 1
* read a line from script
  dlres = read(datalist)
  dlrc = sublin(dlres,1)
  if (dlrc!=0); break; endif
  dlrec = sublin(dlres,2)
  dataset = subwrd(dlrec,1)
  if (verb)
    say ''
    say 'dataset='dataset  ;* this can be wrapped with 'if (verb)' when script is debugged
  endif

* Parse the dataset name for relevant keywords
  nc = math_strlen(dataset)
  c = 1
  beg = 1
  w = 1
  while (c <= nc)
    char = substr(dataset,c,1)
    if (char='/')
      word.w = substr(dataset,beg,c-beg)
      beg = c + 1
      w = w + 1
    endif      
    c = c + 1
  endwhile
  word.w = substr(dataset,beg,c-beg)
  _exp   = word.1
  _realm = word.2
  _freq  = word.3
  _MIP   = word.4
  _var   = word.5
  _model = word.6
  _ens   = word.7
  if (verb); say 'freq='_freq; endif

* Check for .noxtl and .noctl files 
* The .noxtl file is for data sets that require a PDEF file
* The .noctl file is for data sets that can't be described at all, e.g. daily data on 360-day calendars
  symdir = '/data/cmip5/data/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_model'/'_ens
  noxtl = symdir'/.noxtl'
  noctl = symdir'/.noctl'
  gotnoxtl = isfile(noxtl)
  gotnoctl = isfile(noctl)
  if (gotnoxtl=0) ;* .noxtl is missing
*   this test should fail for all items in the datalist, but leave it in for possible expansion 
    say 'missing .noxtl in 'symdir
    continue
  endif
  if (gotnoctl=1) ;* .noctl is present 
    say 'REMINDER no .ctl descriptor will be written for 'symdir
    continue
  endif

* Create descriptor file name
  ctl   = '/data/cmip5/ctl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_var'_'_model'_'_ens'_0p5.ctl'

* Check if a descriptor already exists
  check=1
  if (check)
    got = isfile(ctl)
    if (got=1) 
      if (verb); say 'already have 'ctl; endif
      continue
    else
      say 'creating ... 'ctl
    endif
  endif

* Count the data files
  '!ls 'symdir'/*.nc | wc | cut -c1-7 > ./wdtmp'
  result = read("./wdtmp")
  rc1 = sublin(result,1)
  rc2 = sublin(result,2)
  if (rc1 = 0)
    fc = subwrd(rc2,1)
  endif
  rc = close("./wdtmp"); '!rm -f ./wdtmp'
  if (fc=0) 
    say 'ERROR no data files for 'dataset
    continue
  else
    if (fc=1)
      tmplat=0
    else
      tmplat=1
    endif
  endif
  if (verb); say 'tmplat='tmplat' and fc='fc; endif

* Get starting time from first data file
  '!/bin/ls 'symdir'/*.nc | head -1 > ./wdtmp'
  result = read("./wdtmp")
  rc1 = sublin(result,1)
  rc2 = sublin(result,2)
  if (rc1 = 0)
    bfname = subwrd(rc2,1)
    getdates(bfname,"beg")
  endif
  rc = close("./wdtmp"); '!rm -f ./wdtmp'

* Get ending time from last data file
  '!ls 'symdir'/*.nc | tail -1 > wdtmp'
  result = read("./wdtmp")
  rc1 = sublin(result,1)
  rc2 = sublin(result,2)
  if (rc1 = 0)
    efname = subwrd(rc2,1)
    getdates(efname,"end")
  endif
  rc = close("./wdtmp"); '!rm -f ./wdtmp'

  if (verb)
   say 'bfn='bfname' '_begdy%_begmon%_begyr
   say 'efn='efname' '_enddy%_endmon%_endyr
  endif

* Get the calendar attribute for daily data
  noleap=0
  if (_freq='day')
    '!'_script_path'/get_calendar.sh 'bfname' > ./wdtmp'
    result = read("./wdtmp")
    rc1 = sublin(result,1)
    rc2 = sublin(result,2)
    if (rc1 = 0)
      cal = subwrd(rc2,1)
    endif
    rc = close("./wdtmp"); '!rm -f ./wdtmp'
    if (cal='"cal365"');      noleap=1; endif
    if (cal='"altcal365"');   noleap=1; endif
    if (cal='"common_year"'); noleap=1; endif
    if (cal='"365_day"');     noleap=1; endif
    if (cal='"noleap"');      noleap=1; endif
    if (verb); say 'noleap='noleap' calendar='cal; endif
  endif

* Figure out how many time steps span all the files
  if (_freq='mon')
    'open '_script_path'/dummy_mon.ctl'
    'set time 01'_begmon%_begyr' 01'_endmon%_endyr
    'q dims'
    line5=sublin(result,5)
    t1 = subwrd(line5,11)
    t2 = subwrd(line5,13)
    tsize=t2-t1+1
    if (verb); say tsize' months'; endif
    'close 1'
  endif
  if (_freq='day')
    if (noleap)
      'open '_script_path'/dummy_365day.ctl'
    else
      'open '_script_path'/dummy_day.ctl'
    endif
  
  'set time '_begdy%_begmon%_begyr' '_enddy%_endmon%_endyr
    'q dims'
    line5=sublin(result,5)
    t1 = subwrd(line5,11)
    t2 = subwrd(line5,13)
    tsize=t2-t1+1
    if (verb); say tsize' days'; endif
    'close 1'
  endif

* Create descriptor file entries for DSET, TDEF, and OPTIONS
  optflg=0
  if (tmplat=0)
    DSET='DSET 'bfname
    OPTIONS='OPTIONS '
  else
    len = math_strlen(bfname)
    fnstub=substr(bfname,1,len-_byy-1)
    DSET='DSET 'fnstub'%ch.nc'
    OPTIONS='OPTIONS template'
    optflg=1
  endif
  if (_freq='day')
    TDEF='TDEF 'tsize' linear '_begdy%_begmon%_begyr' 1dy'
    if (noleap)
      OPTIONS=OPTIONS' 365_day_calendar'
      optflg=1
    endif
  endif
  if (_freq='mon')
    TDEF='TDEF 'tsize' linear '_begdy%_begmon%_begyr' 1mo'
  endif

* Create ZDEF entry
  ZDEF=''_script_path'/esmf/zdef.txt'
  zvarying=0
  nlevs=0
* These are the Z-varying variables out of the complete set of downloaded ocean variables. 
  if (_var = 'so' | _var='thetao' | _var='rhopoto' | _var='uo' | _var='vo') 
    zvarying=1
  endif
  if (zvarying)
*   Use ncks to get the values for the lev coordinate axis
    '!ncks -H -u -v lev 'bfname' > ./wdtmp'
    nlevs=0
    nrows=1
    lev=0
    vals=''
    while(1)
     lres = read("./wdtmp")
     lrc = sublin(lres,1)
     if (lrc!=0); break; endif
     lrec = sublin(lres,2)
     c3=substr(lrec,1,3)
     if (c3='lev')
       len=math_strlen(lrec)
       nlevs=nlevs+1
       if (nlevs<=10)
         prefix=7
       else
         prefix=8
       endif
       val=substr(lrec,prefix+1,len-2-prefix)
       vals=vals' 'val
       vlen=math_strlen(vals)
       if (vlen>72) 
         rvals.nrows = vals
         nrows=nrows+1
         vals=''
       endif
     else 
       break
     endif
    endwhile
    rvals.nrows = vals
    rc = close("./wdtmp"); '!/bin/rm -f ./wdtmp'
    if (nrows=1)
      '!echo ZDEF 'nlevs' levels 'vals' >> 'ZDEF
    else 
     r=1
     '!echo ZDEF 'nlevs' levels  >> 'ZDEF
     while (r<=nrows)
       '!echo 'rvals.r' >> 'ZDEF
       r=r+1
     endwhile
    endif
  else
    '!echo ZDEF 1 linear 0 1 >> 'ZDEF
  endif


* Get CHSUB entries
  if (tmplat)
    chsubs=''_script_path'/chsub.txt'
    '!cp '_script_path'/dummy_stub.ctl '_script_path'/dummy.ctl'
    '!echo 'TDEF' >> '_script_path'/dummy.ctl'
    if (noleap); '!echo OPTIONS 365_day_calendar >> '_script_path'/dummy.ctl'; endif
    'open '_script_path'/dummy.ctl'
    '!ls 'symdir'/*.nc > ./wdtmp'
    pt1 = -1
    pt2 = -1
    while (1)
      result = read("./wdtmp")
      rc1 = sublin(result,1)
      if (rc1!=0); break; endif
      rc2 = sublin(result,2)
      bfname = subwrd(rc2,1)
      getdates(bfname,"both")
      a=_begdy%_begmon%_begyr
      b=_enddy%_endmon%_endyr
      if (a=b)
        tdim='fixed'
        t1pos=9
        t2pos=9
      else 
        tdim='varying'
        t1pos=11
        t2pos=13
      endif
      'set time '_begdy%_begmon%_begyr' '_enddy%_endmon%_endyr
      'q dims'
      line5=sublin(result,5)
      t1 = subwrd(line5,t1pos)
      t2 = subwrd(line5,t2pos)
      if (verb); say 'pt1='pt1' pt2='pt2' t1='t1' t2='t2; endif
*     check for a discontinuity in data files
      if (pt2>0 & t1!=pt2+1) 
        gap=t1-pt2-1
        if (_freq='day')
          say 'ALERT 'gap' times missing in cmip5.output1.'_model'.'_exp'.'_freq'.'_realm'.'_MIP'.'_ens'.'_var' between 'peyr%pemo%pedy' and '_begyr%_begmo%_begdy
        endif
        if (_freq='mon')
          say 'ALERT 'gap' times missing in cmip5.output1.'_model'.'_exp'.'_freq'.'_realm'.'_MIP'.'_ens'.'_var' between 'peyr%pemo' and '_begyr%_begmo
        endif
        write_ctl = 2
      endif
      if (_freq='day')
        '!echo CHSUB 't1' 't2' '_begyr%_begmo%_begdy'-'_endyr%_endmo%_enddy' >> 'chsubs
      endif
      if (_freq='mon')
        '!echo CHSUB 't1' 't2' '_begyr%_begmo'-'_endyr%_endmo' >> 'chsubs
      endif
      pt1 = t1
      pt2 = t2
      pbyr = _begyr
      pbmo = _begmo
      pbdy = _begdy
      peyr = _endyr
      pemo = _endmo
      pedy = _enddy
    endwhile
    rc = close("./wdtmp"); '!rm -f ./wdtmp'
    'close 1'
    '!/bin/rm -f '_script_path'/dummy.ctl'
  endif

* Create the PDEF file
  pdir  = '/data/cmip5/ctl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/pdefs'
  pfile = _var'_'_model'_'_ens'_0p5.pdef'

* Build the command to invoke the ESMF tool RegridWeightGen
* all grids are bi-linearly interpolated to a 0.5-degree grid, defined by linear0p5.nc
* additional arguments may be changed according to user preference 
* the resulting interpolation weights are written out to weights.nc
  cmd='!'_script_path'/esmf/ESMF_RegridWeightGen'
  cmd=cmd' -i -p none'
  cmd=cmd' -s 'bfname
  cmd=cmd' --src_type GRIDSPEC --src_coordinates lon,lat'
  cmd=cmd' -d '_script_path'/esmf/linear0p5.nc'
  cmd=cmd' -w '_script_path'/esmf/weights.nc'
  cmd

* Build the command to invoke the program weights2pdef
* this will convert the data in weights.nc into a pdef file 
  cmd2='!./weights2pdef '_script_path'/esmf/weights.nc 'pfile '> ./wdtmp'
  cmd2
  result=read("./wdtmp")
  PDEF=sublin(result,2)
  check = subwrd(PDEF,1)
  rc=close("./wdtmp"); '!/bin/rm -f ./wdtmp'
  if (check != 'PDEF') 
    say 'ERROR from weights2pdef for 'symdir
    continue
  endif

* Now build the descriptor file
  if (write_ctl=2)
*   write a temporary one that might need repair
    ctl = ''_script_path'/tmpctl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_var'_'_model'_'_ens'_0p5.ctl'
    say ctl
    '!mkdir -p '_script_path'/tmpctl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var
  else
*   create the directory for the ctl file and pdef file
    '!mkdir -p /data/cmip5/ctl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var
    '!mkdir -p 'pdir
*   move the pdef file to that location
    '!mv 'pfile' 'pdir'/'
  endif

  rc = write(ctl,DSET)
  if (optflg)
    rc = write(ctl,OPTIONS,append)
  endif
  rc = write(ctl,"DTYPE netcdf",append)
  title='TITLE CMIP5 Data '_exp' '_realm' '_freq' '_MIP' '_model' '_ens' '_var' interpolated to 0.5-degree grid'
  rc = write(ctl,title,append)
  rc = write(ctl,"UNDEF -9.99e8 missing_value",append)
  rc = write(ctl,PDEF,append)
  rc = write(ctl,"XDEF 720 linear 0.25 0.5 ",append)
  rc = write(ctl,"YDEF 360 linear -89.75 0.5",append)
  rc = write(ctl,TDEF,append)
  rc = write(ctl,"vars 1 ",append)
  if (zvarying=1)
    VAR=_var' 'nlevs' t,z,y,x '_var
  else
    VAR=_var' 0 t,y,x '_var
  endif
  rc = write(ctl,VAR,append)
  rc = write(ctl,"endvars",append)
  rc = close(ctl)
  if (tmplat)
    '!cat 'chsubs' >> 'ctl
    '!/bin/rm -f 'chsubs
  endif
  '!cat 'ZDEF' >> 'ctl
  '!/bin/rm -f 'ZDEF

* Test to make sure .ctl file can be opened successfully
  'open 'ctl
  if (rc=1)
    if (write_ctl!=2) 
*     move the broken ctl into the place for broken descriptors
      '!mkdir -p '_script_path'/tmpctl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var
      tmpctl =  ''_script_path'/tmpctl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_var'_'_model'_'_ens'.ctl'
      '!cp -f 'ctl' 'tmpctl
      '!rm -f 'ctl
      say 'ALERT open error for 'tmpctl
    else
      say 'ALERT open error for 'ctl
    endif
  endif
  'reinit'
endwhile
'!rm -f ./wdtmp'
'quit'



* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* gets the beginning and/or ending date strings from a file name
function getdates(fname,which)
len = math_strlen(fname)
if (_freq='mon'); _byy=15; _eyy= 8; endif
if (_freq='day'); _byy=19; _eyy=10; endif

if (which='beg' | which='both')
  _begdy = '01'
  start=len-_byy
  _begyr = substr(fname,start,4)
  _begmo = substr(fname,start+4,2)
  if (_freq='day')
    _begdy = substr(fname,len-_byy+6,2)
  endif
  _begmon=subwrd(_mons,_begmo)
endif

if (which='end' | which='both')
  _enddy = '01'
  _endyr = substr(fname,len-_eyy,4)
  _endmo = substr(fname,len-_eyy+4,2)
  if (_freq='day')
    _enddy = substr(fname,len-_eyy+6,2)
  endif
  _endmon=subwrd(_mons,_endmo)
endif

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* function isfile(file)
* Determines whether the named file exists
*
function isfile(file)
'!'_script_path'/isfile.sh 'file' > ./wdtmp'
result=read("./wdtmp")
l2=sublin(result,2)
got=subwrd(l2,1)
rc=close("./wdtmp")
'!/bin/rm -f ./wdtmp'
return got

