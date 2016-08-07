#!/usr/bin/env node
var fs = require('fs');

// This will ingest a segmented CSV and extrapolate the #Mirage index for every hour concerned

// functions for analysis
var original = [],
    working = [],
    result;

// given a stream, returns array of arrays
function componenter(data) {
    
    // return an array of arrays
    rawArray = data.split('\n');

    infoArray = rawArray.map(function(line) {
        return line.split("\",").map(function(entry) {
            return entry.trim();
        });
    });

    return infoArray;
}

// converts IFTTT time formatting to ISO 8601
function isoTime(time) {

    // return isoTimestamp
    
    var date;
    time = time.split(" at ").join(" ");

    ampm = time.split(", ")[1].substr(10, 2);

    if (ampm == "AM") {
        hour = parseInt(time.split(", ")[1].substr(6, 2));
        if (hour == 12) {
            hour24 = 0;
        }
        
        // truncates to hours
        date = time.substr(0, time.length - 7) + "00:00.000Z";
    } else {
        hour = parseInt(time.split(", ")[1].substr(6, 2));
        if (hour != 12) {
            hour24 = hour + 12;
        }

        // truncates to hours
        date = time.substr(0, time.length - 7) + hour24.toString() + ":00.000Z";
    }
    
    return new Date(Date.parse(date)).toISOString();
}

// returns ISO Timestamps of hours in between using UNIX timestamp to convert
function getIntervals(start, end) {

    // return array
    timeDifference = new Date(end) - new Date(start);
    timeSlots = parseInt(timeDifference / 3600000);

    intervals = [];
    for (k = 0; k < timeSlots - 1; k ++) {
        intervalTime = new Date( new Date(start).getTime() + 3600000 * k );
        intervals.push(intervalTime.toISOString());
    } 

    return intervals;
}

// gets value at hourly intervals
// valuesArray = [[ISO Timestamp, value], [ISO Timestamp, value]]
function extrapolateValues(valuesArray) {

    result = [];

    beginningTime = new Date(valuesArray[0][0]).getTime();
    endingTime = new Date(valuesArray[1][0]).getTime();

    beginningVal = parseInt(valuesArray[0][1]);
    endingVal = parseInt(valuesArray[1][1]);

    intervalCount = parseInt((endingTime - beginningTime) / 3600000);

    if (intervalCount < 1) return result;

    intervalVals = endingVal - beginningVal;

    if (intervalCount < 0) throw "Interval Count cannot be nagative";

    valPerHour = intervalVals / intervalCount;

    for (k = 1; k < intervalCount; k ++) {
        
        dateString = new Date(beginningTime + k * 3600000).toISOString();
        val = beginningVal + k * valPerHour;

        result.push([dateString, val]);

    }

    return result;

};

// STDIN input
var ioStream = process.stdin;
var data = "";

ioStream.resume();
ioStream.setEncoding("utf8");

ioStream.on("data", function(chunk) {
    data += chunk;
});

ioStream.on("end", function() {
    main(data);
});

// data processing and extrapolation
function main(datapile) {
    original = componenter(datapile);
    
    for (i = 0; i < original.length - 1; i ++) {

        startTime = isoTime(original[i][0]);
        endTime = isoTime(original[i + 1][0]);
        startValue = original[i][1];
        endValue = original[i + 1][1];

        // add the start value
        working.push([startTime, startValue]);

        // intermediate values
        working = working.concat(extrapolateValues([[startTime, startValue], [endTime, endValue]]));

    }

    // if final entry, add final entry
    if (i == original.length - 1) {
        working.push([isoTime(original[i][0]), original[i][1]]);
    }

    result = working.join("\n");

    process.stdout.write(result);
    ioStream.pause();
};

