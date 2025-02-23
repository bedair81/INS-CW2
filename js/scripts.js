// Function to update the table with data from the API
function updateTable(data, labels, crowding) {
    var table = document.getElementById("crowding-table");
    table.innerHTML = ""; // Clear existing content
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "<b>Time</b>";
    var cell2 = row.insertCell(1);
    cell2.innerHTML = "<b>Crowding(%)</b>";
    for (var i = 0; i < labels.length; i++) {
        var row = table.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = labels[i];
        var cell2 = row.insertCell(1);
        cell2.innerHTML = crowding[i];
    }
}

// Function to update the spans with AM and PM peak times from the API
function updateSpan(data) {
    // Use fallback values if properties are missing to prevent errors
    var ampeaktime = data.amPeakTimeBand || "N/A";
    var pmpeaktime = data.pmPeakTimeBand || "N/A";
    document.getElementById("ampeak").innerHTML = "AM Peak: " + ampeaktime;
    document.getElementById("pmpeak").innerHTML = "PM Peak: " + pmpeaktime;
}

// Function to create a bar chart using Chart.js
function createChart(data, labels, crowding) {
    // If a chart already exists, destroy it to prevent overlap
    var chartExist = Chart.getChart("myChart"); // <canvas> id
    if (chartExist != undefined) {
        chartExist.destroy();
    }
    // Create a new bar chart
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Crowding',
                data: crowding,
                borderWidth: 1,
                borderColor: '#36A2EB',
                backgroundColor: '#9BD0F5',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Function to process API data and update the page
function updatePage(data) {
    console.log("updatePage called with data:", data);
    // Check if timeBands exists to prevent errors
    if (!data.timeBands) {
        console.error("timeBands is undefined");
        return;
    }
    // Use map for efficient extraction and transformation
    var labels = data.timeBands.map(tb => tb.timeBand);
    var crowding = data.timeBands.map(tb => Math.round(tb.percentageOfBaseLine * 100));
    // Update the chart, spans, and table
    createChart(data, labels, crowding);
    updateSpan(data);
    updateTable(data, labels, crowding);
}

// Function to fetch data from the TfL API
function fetchdata() {
    console.log("fetchdata called");
    var naptanID = document.getElementById("station-select").value;
    // Convert day to lowercase to match API expectations (e.g., "mon" instead of "MON")
    var day = document.getElementById("day-select").value.toLowerCase();
    var url = "https://api.tfl.gov.uk/Crowding/" + naptanID + "/" + day;
    console.log("Fetching from:", url);
    fetch(url, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'app_key': '3db56867d404421a91442b31d4c832c7',
        }
    })
        .then(res => {
            console.log("Fetch response:", res);
            return res.json();
        })
        .then(data => {
            console.log("Data received:", data);
            updatePage(data);
        })
        .catch(err => console.error("Fetch error:", err));
}