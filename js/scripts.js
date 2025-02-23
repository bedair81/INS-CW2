// Initialize theme based on system preference and monitor changes
function initializeTheme() {
    const setTheme = () => {
        document.documentElement.setAttribute('data-bs-theme', 
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    };
    setTheme(); // Set initial theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
}

// Populate table with crowding data
function updateTable(labels, crowding) {
    const table = document.getElementById('crowding-table');
    table.innerHTML = ''; // Reset table content
    const thead = table.createTHead().insertRow();
    thead.innerHTML = '<th>Time</th><th>Crowding (%)</th>';
    labels.forEach((label, i) => {
        const row = table.insertRow();
        row.innerHTML = `<td>${label}</td><td>${crowding[i]}</td>`;
    });
}

// Update peak time spans with API data
function updatePeakTimes(data) {
    document.getElementById('ampeak').textContent = data.amPeakTimeBand || 'N/A';
    document.getElementById('pmpeak').textContent = data.pmPeakTimeBand || 'N/A';
}

// Render bar chart with Chart.js, adapting to current theme
function renderChart(labels, crowding) {
    const chart = Chart.getChart('myChart');
    if (chart) chart.destroy(); // Clear existing chart
    const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    new Chart(document.getElementById('myChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Crowding (%)',
                data: crowding,
                borderWidth: 1,
                borderColor: isDarkMode ? '#ffffff' : '#0000FF',
                backgroundColor: isDarkMode ? '#6c757d' : '#ADD8E6'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { color: isDarkMode ? '#f8f9fa' : '#000000' } },
                x: { ticks: { color: isDarkMode ? '#f8f9fa' : '#000000' } }
            },
            plugins: {
                title: { display: true, text: 'Daily Crowding Levels', color: isDarkMode ? '#f8f9fa' : '#000000' },
                legend: { labels: { color: isDarkMode ? '#f8f9fa' : '#000000' } }
            }
        }
    });
}

// Process API response and update UI components
function processData(data) {
    if (!data.timeBands) {
        console.error('No timeBands data available');
        return;
    }
    const labels = data.timeBands.map(tb => tb.timeBand);
    const crowding = data.timeBands.map(tb => Math.round(tb.percentageOfBaseLine * 100));
    renderChart(labels, crowding);
    updatePeakTimes(data);
    updateTable(labels, crowding);
}

// Fetch crowding data from TfL API
async function fetchData() {
    const naptanID = document.getElementById('station-select').value;
    const day = document.getElementById('day-select').value;
    const url = `https://api.tfl.gov.uk/Crowding/${naptanID}/${day}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'app_key': '3db56867d404421a91442b31d4c832c7'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        processData(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Initialize theme on load
initializeTheme();