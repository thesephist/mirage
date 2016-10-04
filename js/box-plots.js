var Mirage = {};

Mirage.raw = $("#csv").html().trim();
Mirage.array = Mirage.raw.split("\n").map(function(row) {
    return row.split(",");
});

var days = Math.floor(Mirage.array.length / 24),
    weeks = Math.floor(Mirage.array.length / 168);

Mirage.datasets = {

    hourly: new Array(24),

    daily: new Array(7),

    weekly: new Array(weeks)

}

// hourly
for (i = 6; i < 30; i ++) {
    Mirage.datasets.hourly[i - 6] = [];

    for (j = 0; j < days; j ++) {
        var record = Mirage.array[24 * j + (i % 24)];
        if (record[2] === 'original') Mirage.datasets.hourly[i - 6].push(record[1]);
    }
}

// daily
for (i = 0; i < 7; i ++) {
    Mirage.datasets.daily[i] = [];

    for (j = 0; j < weeks; j ++) {
        for (k = 0; k < 24; k ++) {
            var record = Mirage.array[168 * j + 24 * i + k];
            if (record[2] === 'original') Mirage.datasets.daily[i].push(record[1]);
        }
    }
}


// weekly
for (i = 0; i < weeks; i ++) {
    Mirage.datasets.weekly[i] = [];

    for (j = 0; j < 7; j ++) {
        for (k = 0; k < 24; k ++) {
            var record = Mirage.array[168 * i + 24 * j + k];
              if (record[2] === 'original') Mirage.datasets.weekly[i].push(record[1]);
        }
    }
}

// plotly chart generation

Mirage.boxcharts = {};
Mirage.boxcharts.layout = {
    showlegend: false
};

Mirage.boxcharts.hourly = Plotly.newPlot('mirageHourlyBox',
    Mirage.datasets.hourly.map(function(set) {
        return {
            y: set,
            type: 'box',
            boxpoints: 'suspectedoutliers'
        };
    }),
    Mirage.boxcharts.layout
);

Mirage.boxcharts.daily = Plotly.newPlot('mirageDailyBox',
    Mirage.datasets.daily.map(function(set) {
        return {
            y: set,
            type: 'box',
            boxpoints: 'suspectedoutliers'
        };
    }),
    Mirage.boxcharts.layout
);

Mirage.boxcharts.weekly = Plotly.newPlot('mirageWeeklyBox',
    Mirage.datasets.weekly.map(function(set) {
        return {
            y: set,
            type: 'box',
            boxpoints: 'suspectedoutliers'
        };
    }),
    Mirage.boxcharts.layout
);
