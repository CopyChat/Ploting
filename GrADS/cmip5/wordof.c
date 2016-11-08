/* wordof.c 
 * gcc -o wordof wordof.c 
 */
#include <stdio.h>

main (int argc, char *argv[]) {
int i;
  if (argc<3) {
    printf ("Error\n");
    return;
  } 
  i = 0;
  i = atoi(argv[1]);
  if (i>argc-2) {
    printf ("Error\n");
    return;
  }
  printf ("%s\n",argv[i+1]);
}
