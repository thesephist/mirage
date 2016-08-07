#!/bin/sh
# script to wget the #Mirage CSV file from Google Sheets, pipe it into extrapolate.js, and output as CSV

wget --quiet "https://docs.google.com/spreadsheet/ccc?key=KEYHASH&output=csv" -O "data.csv"
echo 'Download finished!'

echo '...'
cat data.csv | node extrapolate.js > complete.csv
echo 'Export complete!'
echo ''
echo "Errors?"
grep "NaN" complete.csv

