const tempChartContext = document.getElementById('tempChart').getContext('2d');
const humidityChartContext = document.getElementById('humidityChart').getContext('2d');

let tempChart;
let humidityChart;
let timeLabels = [];
const MAX_DATA_POINTS = 20;

function initializeCharts() {
    for (let i = 0; i < MAX_DATA_POINTS; i++) {
        timeLabels.push('');
    }

    tempChart = new Chart(tempChartContext, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Temperature (°C)',
                data: Array(MAX_DATA_POINTS).fill(null),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 10,
                    max: 40,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', maxTicksLimit: 5 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    humidityChart = new Chart(humidityChartContext, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Humidity (%)',
                data: Array(MAX_DATA_POINTS).fill(null),
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 40,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', maxTicksLimit: 5 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateCharts() {
    // Check if the dashboard function is available
    if (typeof getLiveEnvData !== 'function') {
        return; // Wait for dashboard.js to load
    }

    const envData = getLiveEnvData();
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Temperature Chart
    if (tempChart.data.datasets[0].data.length >= MAX_DATA_POINTS) {
        tempChart.data.datasets[0].data.shift();
    }
    tempChart.data.datasets[0].data.push(envData.temp);

    // Humidity Chart
    if (humidityChart.data.datasets[0].data.length >= MAX_DATA_POINTS) {
        humidityChart.data.datasets[0].data.shift();
    }
    humidityChart.data.datasets[0].data.push(envData.humidity);

    // Labels
    if (tempChart.data.labels.length >= MAX_DATA_POINTS) {
        tempChart.data.labels.shift();
        humidityChart.data.labels.shift();
    }
    
    // Only add a label every 10 seconds
    const label = (now.getSeconds() % 10 === 0) ? timeString : '';
    tempChart.data.labels.push(label);
    humidityChart.data.labels.push(label);

    tempChart.update('none'); // 'none' for no animation
    humidityChart.update('none');
}

document.addEventListener('DOMContentLoaded', () => {
    // Check for dashboard.js
    if (typeof getLiveEnvData !== 'function') {
        console.error("Dependency error: getLiveEnvData function not found. dashboard.js must be loaded first.");
        return;
    }
    
    initializeCharts();
    
    // Start chart updates
    setInterval(updateCharts, 2000); // Same interval as sensors
});