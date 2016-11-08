   file='http://www.monsoondata.org:9090/dods/topo/rose/etopo05'
   'sdfopen 'file''
   'set mpdset hires'
   'set display color white'
   'clear'

  lat_bound='32 41.5'
  lon_bound='-115.5 -105'

  lat='32.5 40.25'
  lon='-115.0 -105.5'

   res=40000


  'set xlab off';'set ylab off'
  'set gxout shaded'
  'set grads off'
  'set lat 'lat_bound
  'set lon 'lon_bound

  'color 50 5200 100 -kind green->tan->dimgray'
  'd rose'

  'q w2xy 'subwrd(lon,1)' 'subwrd(lat,1)
  xpos1=subwrd(result,3);ypos1=subwrd(result,6)

  'q w2xy 'subwrd(lon,2)' 'subwrd(lat,2)
  xpos2=subwrd(result,3);ypos2=subwrd(result,6)

  'set line 4 1 8'
*  'draw rec 'xpos1' 'ypos1' 'xpos2' 'ypos2''


  latstart=subwrd(lat,1);latend=subwrd(lat,2)
  lonstart=subwrd(lon,1);lonend=subwrd(lon,2)

  mperlat=111200
  r_earth=6378000
  pi=3.141592


   avg_lat=(latstart+latend)/2
   delta_lon=(res/r_earth)*(180/pi)/math_cos(avg_lat*pi/180)
   delta_lat=res/mperlat

  'set line 2 1 1'        ;*Formatting
   latstart=latstart-delta_lat/2

   lat=latstart
   while(lat < latend)

     lat1=lat
     lat2=lat1+delta_lat
     lon=lonstart-delta_lon/2

     while(lon < lonend)
       lon1=lon
       lon2=lon1+delta_lon


       'q w2xy 'lon1' 'lat1
        xpos1=subwrd(result,3);ypos1=subwrd(result,6)

       'q w2xy 'lon2' 'lat2
        xpos2=subwrd(result,3);ypos2=subwrd(result,6)

*       'draw rec 'xpos1' 'ypos1' 'xpos2' 'ypos2''
       lon=lon+delta_lon
    endwhile
    lat=lat+delta_lat
  endwhile

  'checkered  -s 1.0 -w 0.1 -ss 0.09'
