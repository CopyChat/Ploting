* write_xtl.gs
*
* Creates xdfopen-style descriptors for CMIP5 data
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
*   /data/cmip5/xtl/experiment/realm/frequency/MIP/variable/variable_institute.model_ensemble.xtl
*
* If a directory contains a dataset that is unsuitable for xdfopen,
* then touch a file called ".noxtl" in that directory. This script 
* will check for the .noxtl file, and print out an ALERT message 
* if .noxtl is needed but not present.
* 
* Calls external utilities: ncdump, get_calendar.sh, wordof, isfile.sh, get_basin.sh
* Needs external files: dummy_365day.ctl, dummy_day.ctl, dummy_mon.ctl, dummy_stub.ctl



function main(arg)
datalist=subwrd(arg,1)
if (datalist='')
 say 'Usage: write_ddf <datalist>'
 return
endif

verb=0
_mons='jan feb mar apr may jun jul aug sep oct nov dec'
_script_path='/project/cmip5/jma'



* Read the datasets from the datalist
while (1)
* reset the ddf flag
  write_ddf = 1
* read a line from the input file
  dlres = read(datalist)
  dlrc = sublin(dlres,1)
  if (dlrc!=0); break; endif
  dlrec = sublin(dlres,2)
  dataset = subwrd(dlrec,1)
  if (verb)
    say ''
    say 'dataset='dataset
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

* Check if .noxtl file exits
  symdir = '/data/cmip5/data/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_model'/'_ens
  noctl = symdir'/.noxtl'
  got = isfile(noctl)
  if (got=1) 
    say 'REMINDER no .xtl descriptor will be written for 'symdir
    continue
  endif

* Create descriptor file name
  xtl = '/data/cmip5/xtl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_var'_'_model'_'_ens'.xtl'

* Check if a descriptor already exists
  check=1
  if (check)
    got = isfile(xtl)
    if (got=1) 
      if (verb); say 'already have 'xtl; endif
      continue
    else
      say 'creating ... 'xtl
    endif
  endif

* No TDEF for fixed fields
  if (_freq='fx')
    notdef=1
    tmplat=0
  else 
    notdef=0
  endif

* Count the data files
  if (notdef=0)
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
  endif 

* Get starting time from first data file
  '!ls 'symdir'/*.nc | head -1 > ./wdtmp'
  result = read("./wdtmp")
  rc1 = sublin(result,1)
  rc2 = sublin(result,2)
  if (rc1 = 0)
    bfname = subwrd(rc2,1)
    if (notdef=0)
      getdates(bfname,"beg")
    endif
  endif
  rc = close("./wdtmp"); '!rm -f ./wdtmp'


* Check for "rotated pole grid" in ncdump output
* These files are unsuitable for xdfopen and the directory will need a .noxtl file
  '!ncdump -h 'bfname' | grep "rotated pole grid" | wc | cut -c1-7 > ./wdtmp'
  result = read("./wdtmp")
  rc1 = sublin(result,1)
  rc2 = sublin(result,2)
  if (rc1 = 0)
    fc = subwrd(rc2,1)
  endif
  rc = close("./wdtmp"); '!rm -f ./wdtmp'
  if (fc!=0) 
    say 'ALERT touch 'symdir'/.noxtl'
    say 'REMINDER no .xtl descriptor will be written for 'symdir
    continue
  endif


  if (notdef=0)
*   Get ending time from last data file
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

*   Get the calendar attribute for daily data
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

*   Figure out how many time steps span all the files
    if (_freq='mon')
      'open '_script_path'/dummy_mon.ctl'
      'set time 01'_begmon%_begyr' 01'_endmon%_endyr
      'q dims'
      line5=sublin(result,5)
      word3=subwrd(line5,3)
      if (word3='fixed')
        tsize=1
      else
        t1 = subwrd(line5,11)
        t2 = subwrd(line5,13)
        tsize=t2-t1+1
      endif
      'close 1'
      if (verb); say tsize' months'; endif
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
    XTDEF='TDEF time 'tsize' linear '_begdy%_begmon%_begyr' 1dy'
    if (noleap)
      OPTIONS=OPTIONS' 365_day_calendar'
      optflg=1
    endif
  endif
  if (_freq='mon')
    TDEF='TDEF 'tsize' linear '_begdy%_begmon%_begyr' 1mo'
    XTDEF='TDEF time 'tsize' linear '_begdy%_begmon%_begyr' 1mo'
  endif

* Create XDEF entry for msftmyz
* a variable for which we map the 'basin' coordinate to the X axis
  if (_var='msftmyz')
    '!'_script_path'/get_basin.sh 'bfname' > ./wdtmp'
    result = read("./wdtmp")
    rc1 = sublin(result,1)
    rc2 = sublin(result,2)
    if (rc1 = 0)
      nbasins = subwrd(rc2,1)
    endif
    rc = close("./wdtmp"); '!rm -f ./wdtmp'
    XDEF='XDEF basin 'nbasins' linear 1 1'
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
        write_ddf = 2
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

* Now build the descriptor file
  if (write_ddf=2)
*   write a temporary one that might need repair
    xtl = ''_script_path'/tmpxtl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_var'_'_model'_'_ens'.xtl'
    say xtl
    '!mkdir -p '_script_path'/tmpxtl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var
  else
*   create the directory for the xtl file
    '!mkdir -p /data/cmip5/xtl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var
  endif
  rc = write(xtl,DSET)
  if (optflg)
    rc = write(xtl,OPTIONS,append)
  endif
  if (_var='msftmyz')
    rc = write(xtl,XDEF,append)
  endif
  if (notdef=0)
    rc = write(xtl,XTDEF,append)
  endif
  rc = close(xtl)
  if (tmplat)
    '!cat 'chsubs' >> 'xtl
    '!/bin/rm -f 'chsubs
  endif

* Test to make sure .xtl file can be opened successfully
  'xdfopen 'xtl
  if (rc=1)
    if (write_ddf!=2) 
*     move the broken xtl into the place for broken descriptors
      '!mkdir -p '_script_path'/tmpxtl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var
      tmpxtl =  ''_script_path'/tmpxtl/'_exp'/'_realm'/'_freq'/'_MIP'/'_var'/'_var'_'_model'_'_ens'.xtl'
      '!cp -f 'xtl' 'tmpxtl
      '!rm -f 'xtl
      say 'ALERT xdfopen error for 'tmpxtl
    else
      say 'ALERT xdfopen error for 'xtl
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

