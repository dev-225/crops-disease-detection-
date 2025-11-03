// CROP_CLASSES is loaded from main.js, but we provide a fallback.
const CROP_CLASSES = window.CROP_CLASSES || ["Healthy", "Early_Blight", "Late_Blight", "Leaf_Spot", "Rust", "Powdery_Mildew"];

// --- Element Cache ---
const tempValue = document.getElementById('temp-value');
const humidityValue = document.getElementById('humidity-value');
const soilBar = document.getElementById('soil-bar');
const tempStatus = document.getElementById('temp-status');
const humidityStatus = document.getElementById('humidity-status');
const predictionForm = document.getElementById('predictionForm');
const resultsLog = document.getElementById('resultsLog');
const submitButton = document.getElementById('submitButton');
const submitIcon = document.getElementById('submitIcon');
const statusMessage = document.getElementById('statusMessage');
const imagePreview = document.getElementById('imagePreview');

let logInitialized = false;

// --- Sensor Simulation ---
function updateSensors() {
    // Temperature
    let currentTemp = parseFloat(tempValue.textContent);
    let newTemp = currentTemp + (Math.random() - 0.5) * 0.2;
    newTemp = Math.max(15, Math.min(35, newTemp));
    tempValue.textContent = `${newTemp.toFixed(1)}°C`;
    
    if (newTemp > 30) {
        tempStatus.textContent = "HIGH";
        tempStatus.className = "text-sm font-bold text-red-400";
    } else if (newTemp < 20) {
        tempStatus.textContent = "LOW";
        tempStatus.className = "text-sm font-bold text-blue-400";
    } else {
        tempStatus.textContent = "NORMAL";
        tempStatus.className = "text-sm font-bold text-green-400";
    }

    // Humidity
    let currentHumidity = parseFloat(humidityValue.textContent);
    let newHumidity = currentHumidity + (Math.random() - 0.4) * 0.5;
    newHumidity = Math.max(50, Math.min(95, newHumidity));
    humidityValue.textContent = `${newHumidity.toFixed(1)}%`;

    if (newHumidity > 85) {
        humidityStatus.textContent = "CRITICAL";
        humidityStatus.className = "text-sm font-bold text-red-400";
        logAlert("CRITICAL: Humidity > 85%. Fungal risk extremely high.", "high");
    } else if (newHumidity > 75) {
        humidityStatus.textContent = "ELEVATED";
        humidityStatus.className = "text-sm font-bold text-yellow-400";
    } else {
        humidityStatus.textContent = "NORMAL";
        humidityStatus.className = "text-sm font-bold text-green-400";
    }

    // Soil Moisture
    let currentSoil = parseFloat(soilBar.style.width);
    let newSoil = currentSoil + (Math.random() - 0.5) * 0.5; // Slower change
    newSoil = Math.max(30, Math.min(70, newSoil));
    
    soilBar.style.width = `${newSoil.toFixed(1)}%`;
    soilBar.textContent = `${newSoil.toFixed(1)}%`;
}

function getLiveEnvData() {
    return {
        temp: parseFloat(tempValue.textContent),
        humidity: parseFloat(humidityValue.textContent),
        soilMoisture: parseFloat(soilBar.style.width)
    };
}

// --- AI & Rules Engine Simulation ---
function simulatePrediction(envData) {
    const startTime = performance.now();
    
    let predictedIndex;
    let confidenceScore;

    // Rule-based simulation
    if (envData.humidity > 90 || envData.soilMoisture > 65) {
        predictedIndex = CROP_CLASSES.indexOf("Late_Blight");
        confidenceScore = (0.95 + Math.random() * 0.04);
    } else if (envData.temp < 20 && envData.humidity > 80) {
        predictedIndex = CROP_CLASSES.indexOf("Powdery_Mildew");
        confidenceScore = (0.80 + Math.random() * 0.15);
    } else {
        // Random prediction
        predictedIndex = Math.floor(Math.random() * CROP_CLASSES.length);
        confidenceScore = (0.70 + Math.random() * 0.29);
    }
    
    // Ensure "Healthy" is not predicted if conditions are bad
    if (envData.humidity > 85 && CROP_CLASSES[predictedIndex] === "Healthy") {
        predictedIndex = CROP_CLASSES.indexOf("Early_Blight"); // Default disease
    }
    
    const predictedDisease = CROP_CLASSES[predictedIndex];
    
    const inferenceDelay = 50 + Math.random() * 450; // Simulate network lag
    
    return new Promise(resolve => {
        setTimeout(() => {
            const endTime = performance.now();
            resolve({
                disease_predicted: predictedDisease,
                confidence_score: parseFloat(confidenceScore),
                latency_ms: (endTime - startTime).toFixed(2)
            });
        }, inferenceDelay);
    });
}

function getManagementPlan(disease, envData) {
    let recommendation = "";
    let measures = [];
    let isHighRisk = disease !== "Healthy";

    if (disease === "Healthy") {
        recommendation = "Optimal health. Continue routine monitoring.";
        measures = ["Routine canopy checks.", "Soil nutrient test (Q-30 days)."];
        isHighRisk = false;
    } else if (disease === "Late_Blight") {
        recommendation = "IMMEDIATE fungicide application (Systemic recommended).";
        if (envData.humidity > 85) {
            recommendation += " High humidity accelerates spread; increase ventilation.";
        }
        measures = ["Isolate infected plants.", "Avoid overhead irrigation.", "Improve air flow."];
    } else if (disease === "Rust") {
        recommendation = "Apply sulfur-based fungicide.";
        measures = ["Prune affected leaves.", "Ensure good light exposure.", "Clean ground debris."];
    } else {
        recommendation = `Apply tailored fungicide for ${disease}. Consult regional specialist.`;
        measures = ["Monitor moisture levels carefully.", "Maintain soil nutrient balance."];
    }
    
    return { recommendation, measures, isHighRisk };
}

// --- Logging ---
function logAlert(message, level) {
    if (!logInitialized) {
        resultsLog.innerHTML = "";
        logInitialized = true;
    }
    
    let colorClass = level === 'high' ? 'text-red-400' : 'text-yellow-400';
    let timestamp = new Date().toLocaleTimeString();
    
    resultsLog.innerHTML = `<p><span class="text-gray-500">[${timestamp}]</span> <span class="${colorClass} font-bold">[AUTO-ALERT]</span> ${message}</p>` + resultsLog.innerHTML;
}

function logAnalysisResult(disease, confidence, plan) {
    if (!logInitialized) {
        resultsLog.innerHTML = "";
        logInitialized = true;
    }
    
    const currentUser = getCurrentUser(); // From main.js
    let timestamp = new Date().toLocaleTimeString();
    let riskColor = (disease === "Healthy") ? "border-green-500" : "border-red-500";
    let userName = currentUser ? currentUser.name : 'Farmer';

    resultsLog.innerHTML = `
        <div class="p-4 bg-gray-800 rounded-md mb-4 border-l-4 ${riskColor}">
            <p><span class="text-gray-500">[${timestamp}]</span> <span class="text-blue-400 font-bold">[ANALYSIS by ${userName}]</span></p>
            <p class="text-lg font-bold ${disease === 'Healthy' ? 'text-green-400' : 'text-red-400'}">Disease Detected: ${disease}</p>
            <p class="text-sm text-gray-300">Confidence: ${(confidence * 100).toFixed(1)}%</p>
            <div class="mt-2 pt-2 border-t border-gray-700">
                <p class="font-bold text-gray-400">Treatment Plan:</p>
                <p class="text-gray-300">${plan.recommendation}</p>
                <p class="font-bold text-gray-400 mt-2">Measures:</p>
                <ul class="list-disc list-inside text-gray-300 ml-4">
                    ${plan.measures.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>
        </div>
    ` + resultsLog.innerHTML;
    
    // Save this result to be read by prediction.html and advice.html
    localStorage.setItem('lastPrediction', JSON.stringify({
        disease: disease,
        confidence: confidence,
        timestamp: new Date().toISOString(),
        plan: plan
    }));
    
    // Go to the prediction page
    window.location.href = 'prediction.html';
}

// --- Event Listeners ---
function previewImage(event) {
    if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0]);
        imagePreview.src = src;
        imagePreview.classList.remove('hidden');
    } else {
        imagePreview.classList.add('hidden');
    }
}

predictionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!document.getElementById('cropImage').files[0]) {
        statusMessage.textContent = "Upload an image to run the AI diagnosis.";
        return;
    }

    submitButton.disabled = true;
    submitIcon.classList.remove('hidden');
    submitButton.querySelector('span').textContent = 'Analyzing...';
    statusMessage.textContent = 'Connecting to AI backend... Analyzing image...';

    const envData = getLiveEnvData();
    
    try {
        const inferenceResult = await simulatePrediction(envData);
        const plan = getManagementPlan(inferenceResult.disease_predicted, envData);
        
        // This function now handles saving and redirecting
        logAnalysisResult(inferenceResult.disease_predicted, inferenceResult.confidence_score, plan);
        
    } catch (error) {
        statusMessage.textContent = `Analysis failed: ${error.message}`;
        console.error("Prediction Error:", error);
        submitButton.disabled = false;
        submitIcon.classList.add('hidden');
        submitButton.querySelector('span').textContent = '🧠 Run AI Diagnosis';
    }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if main.js is loaded
    if (typeof getCurrentUser !== 'function') {
        console.error("main.js not loaded. Dashboard will fail.");
        alert("Fatal Error: main.js not loaded. Please check file paths.");
        return;
    }
    
    // Start sensor updates
    updateSensors();
    setInterval(updateSensors, 2000);
});