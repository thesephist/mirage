var Mirage = {};

Mirage.raw = $("#csv").html().trim();
Mirage.array = Mirage.raw.split("\n").map(function(row) {
    return row.split(",");
});

// parse into JSON Object
Mirage.parsed = {};
Mirage.array.forEach(function(pair) {
    Mirage.parsed[pair[0]] = pair[1];
});

Mirage.averages = {}
Mirage.records = {}

Mirage.averages.hourly = function() {
    // every 24 entries
    var days = Math.floor(Mirage.array.length / 24); // number of days

    var average;

    Mirage.records.hourly = [];
    for (i = 0; i < 24; i ++) {
        
        average = 0;
        for (j = 0; j < days; j ++) {
            average += parseFloat(Mirage.array[24 * j + i][1]);
        }

        Mirage.records.hourly.push(average / days);
    }
}

Mirage.averages.daily = function() {
    // every 24 entries
    var weeks = Math.floor(Mirage.array.length / 168); // number of days

    var average;

    Mirage.records.daily = [];
    for (i = 0; i < 7; i ++) {
        
        average = 0;
        for (j = 0; j < weeks; j ++) {
            for (k = 0; k < 24; k ++) {
                average += parseFloat(Mirage.array[168 * j + 24 * i + k][1]);
            }
          
        }

        Mirage.records.daily.push(average / weeks / 24);
    }
}

Mirage.averages.hourly();
Mirage.averages.daily();

$(".hourlyavg").html(Mirage.records.hourly.join("<br>"));
$(".dailyavg").html(Mirage.records.daily.join("<br>"));

// draw charts
Mirage.charts = {};
var ctxH = $("#mirageHourlyChart");
Mirage.charts.hourly = new Chart(ctxH, {
    type: 'line',
    data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        datasets: [{
            label: 'Mirage Index',
            data: Mirage.records.hourly,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});
var ctxD = $("#mirageDailyChart");
Mirage.charts.hourly = new Chart(ctxD, {
    type: 'line',
    data: {
        labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
        datasets: [{
            label: 'Mirage Index',
            data: Mirage.records.daily,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});

// User interfaces
$("#mirageHourlyChart").click(function(evt) {
    $(".hourlyavg").show();
});

$("#mirageDailyChart").click(function(evt) {
    $(".dailyavg").show();
});


















