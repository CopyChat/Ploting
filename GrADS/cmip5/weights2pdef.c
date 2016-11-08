/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * weights2pdef.c
 * A program to convert the output from ESMF_RegridWeightGen 
 * into a PDEF file for use with GrADS. Assumes bilinear interpolation
 * method was used.
 *
 *  gcc -o weights2pdef weights2pdef.c -lnetcdf
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

#include <netcdf.h>
#include <stdio.h>
#include <stdlib.h>

void handle_error(int);

int main (int argc, char **argv) 
{

  /* declare variables */
  FILE *pfile;
  float *s=NULL,*wgt=NULL,*rot=NULL;
  size_t start[16],count[16],length;
  int *col=NULL,*row=NULL,*idx=NULL,*cnt=NULL;
  int verb,i,n,num,dest_idx,dimid,colid,rowid,sid,dgdid,status,ncid,gsz;
  int src_grid_dims[2],dst_grid_dims[2];

  /* Speak to the user */
  if (argc != 3) {
    printf("Usage: weights2pdef <weightsfilename> <pdeffilename>\n");
    exit(-1);
  }

  /* Open the weights file */
  status = nc_open(argv[1], NC_NOWRITE, &ncid);
  if (status != NC_NOERR) handle_error(status);

  /* Get relevant info about open NetCDF file */
  status = nc_inq_varid(ncid, "col", &colid);
  if (status != NC_NOERR) handle_error(status);
  status = nc_inq_varid(ncid, "row", &rowid);
  if (status != NC_NOERR) handle_error(status);
  status = nc_inq_varid(ncid, "S", &sid);
  if (status != NC_NOERR) handle_error(status);
  status = nc_inq_var(ncid, sid, NULL, NULL, NULL, &dimid, NULL);
  if (status != NC_NOERR) handle_error(status);
  status = nc_inq_dim(ncid, dimid, NULL, &length);
  if (status != NC_NOERR) handle_error(status);

  /* get the dimensions of the source and destination grids */
  status = nc_inq_varid(ncid, "src_grid_dims", &dgdid);
  if (status != NC_NOERR) handle_error(status);
  start[0]=0; count[0]=2;
  status = nc_get_vara_int(ncid, dgdid, start, count, src_grid_dims);
  if (status != NC_NOERR) handle_error(status);

  status = nc_inq_varid(ncid, "dst_grid_dims", &dgdid);
  if (status != NC_NOERR) handle_error(status);
  start[0]=0; count[0]=2;
  status = nc_get_vara_int(ncid, dgdid, start, count, dst_grid_dims);
  if (status != NC_NOERR) handle_error(status);

  /* allocate memory for weight and index values */
  s   = (float*)malloc(length*sizeof(float));
  col = (int*)malloc(length*sizeof(int));
  row = (int*)malloc(length*sizeof(int));

  /* read in the weights and index values */
  start[0]=0; count[0]=length;
  status = nc_get_vara_float(ncid, sid, start, count, s);
  if (status != NC_NOERR) handle_error(status);
  status = nc_get_vara_int(ncid, colid, start, count, col);
  if (status != NC_NOERR) handle_error(status);
  status = nc_get_vara_int(ncid, rowid, start, count, row);
  if (status != NC_NOERR) handle_error(status);

  /* intialize pdef file grids */
  gsz=dst_grid_dims[0]*dst_grid_dims[1];
  num=4;
  wgt = (float*)malloc(num*gsz*sizeof(float));
  idx = (int*)malloc(num*gsz*sizeof(int));
  rot = (float*)malloc(gsz*sizeof(float));
  cnt = (int*)malloc(gsz*sizeof(int));

  /* initialize idx and wgt grids */
  for (i=0;i<num*gsz;i++) {
    *(idx+i) = -999; 
    *(wgt+i) = 0; 
  }
  /* initialize rot and cnt grids */
  for (i=0;i<gsz;i++) {
    *(rot+i) = -999; 
    *(cnt+i) = 0;    
  }

  /* populate idx and wgt grids */
  for (i=0; i<length; i++) {
    dest_idx = *(row+i)-1;             /* index in destination grid, changed to be 0-based */
    n = *(cnt+dest_idx);               /* 0<=n<4, the number of weights per destination grid point */
    *(idx+n*gsz+dest_idx) = *(col+i);  /* populate the index grid, these should be 1-based */
    *(wgt+n*gsz+dest_idx) = *(s+i);    /* populate the weight grid */
    *(cnt+dest_idx) = n+1;             /* increment the counter */
  }
  
  /* write out the pdef file */
  pfile = fopen(argv[2],"wb");
  for (n=0; n<num; n++) {
    i = fwrite((idx+n*gsz),sizeof(int),gsz,pfile);
    i = fwrite((wgt+n*gsz),sizeof(float),gsz,pfile);
  }
  fwrite(rot,sizeof(float),gsz,pfile);

  /* print a PDEF descriptor file entry */
  printf("PDEF %d %d general 4 stream binary ^pdefs/%s\n",src_grid_dims[0],src_grid_dims[1],argv[2]);

  /* close the data file and the pdef file */
  status = nc_close(ncid);  
  if (status != NC_NOERR) handle_error(status);
  fclose(pfile);

  return 0; 
} /* THE END */


/* Handle return codes */
void handle_error(int status) {
  fprintf(stderr, "%s\n", nc_strerror(status));
}

