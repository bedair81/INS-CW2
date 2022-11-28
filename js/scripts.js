// function to update the table with the data from the API
function updateTable(data, labels, crowding){
    var table = document.getElementById("crowding-table");
    table.innerHTML = "";
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "<b>Time</b>";
    var cell2 = row.insertCell(1);
    cell2.innerHTML = "<b>Crowding(%)</b>";
    for(var i = 0; i < labels.length; i++){
        var row = table.insertRow(i+1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = labels[i];
        var cell2 = row.insertCell(1);
        cell2.innerHTML = crowding[i];
    }
}
// function to update the span with the data from the api for am and pm peak times
function updateSpan(data){
    var ampeaktime = data.amPeakTimeBand;
    var pmpeaktime = data.pmPeakTimeBand;
    document.getElementById("ampeak").innerHTML = "AM Peak: " + ampeaktime;
    document.getElementById("pmpeak").innerHTML = "PM Peak: " + pmpeaktime;
}
function createChart(data, labels, crowding) {
    // if a chart already exists, destroy it
    var chartExist = Chart.getChart("myChart"); // <canvas> id
    if (chartExist != undefined){
        chartExist.destroy();
    } 
    // chart.js code to create a bar chart
    const ctx = document.getElementById('myChart');
    
    // sets the chart type to bar, and the data to be displayed, and the min and max values for the y-axis
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
function updatePage(data) {
    // loop will iterate over timebands key value pairs and add timeBand to an array called labels
    var labels = [];
    for (var key in data.timeBands) {
        labels.push(data.timeBands[key].timeBand);
    }
    // loop will iterate over timebands key value pairs and map percentageOfBaseLine * 100 to an array called crowding
    var crowding = [];
    for (var key in data.timeBands) {
        crowding.push(data.timeBands[key].percentageOfBaseLine * 100);
    }
    //loop will iterate over crowding array and round each value to a whole number
    for (var i = 0; i < crowding.length; i++) {
        crowding[i] = Math.round(crowding[i]);
    }
    // call createChart function to create a bar chart
    createChart(data, labels, crowding);
    updateSpan(data);
    updateTable(data, labels, crowding);
    
}
// this function will construct the url and fetch data from tfl api
function fetchdata(updatePage) {
    naptanID = document.getElementById("station-select").value;
    day = document.getElementById("day-select").value;
    url = "https://api.tfl.gov.uk/crowding/" + naptanID + "/" + day;
    fetch(url, {
    method: 'GET',
    // Request headers
    headers: {
    'Cache-Control': 'no-cache',
    'app_key': '4a977bcfd58f403d8c60da1933f6fed0',}
    })
    .then(res => res.json())
    .then(data => {
        updatePage(data);
    })
    .catch(err => console.error(err));
    }