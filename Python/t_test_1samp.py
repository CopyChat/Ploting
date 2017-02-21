#!/usr/bin/env python

from scipy import stats
import argparse

parser = argparse.ArgumentParser(description='Process some values.')
parser.add_argument('values', metavar='N', type=int, nargs='+',
                            help='individual values + expected mean')

args = parser.parse_args()

#print args.values[0:len(args.values)-1]
#print args.values[-1]

print "%6.3f" % stats.ttest_1samp(args.values[0:len(args.values)-1],args.values[-1])[0]

