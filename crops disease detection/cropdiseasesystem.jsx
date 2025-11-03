// CropDiseaseSystem.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle, Leaf, TrendingUp, FileText } from 'lucide-react';


const API_BASE_URL = 'http://127.0.0.1:5000/api';

const CropDiseaseSystem = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('detect');
    const [envData, setEnvData] = useState({
        temperature: 28,
        humidity: 65,
        rainfall: 5
    });
    const [riskScore, setRiskScore] = useState(null);
    const fileInputRef = useRef(null);

    
    const getRiskLevel = (score) => {
        if (score < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
        if (score < 60) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
        return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    
    const analyzeCrop = async () => {
        if (!selectedImage) {
            alert('Please upload an image first');
            return;
        }

        setLoading(true);
        setPrediction(null); 
        try {
            
            const response = await fetch(`${API_BASE_URL}/predict_disease`, {
                method: 'POST',
                
            });

            if (!response.ok) {
                throw new Error('Server returned an error.');
            }

            const result = await response.json();
            
            
            setPrediction(result); 

        } catch (error) {
            console.error('Error analyzing crop:', error);
            alert(`Analysis failed: ${error.message}. Make sure Python API is running.`);
        } finally {
            setLoading(false);
        }
    };
    
    
    const fetchRiskScore = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/calculate_risk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(envData),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch risk score.');
            }

            const data = await response.json();
            setRiskScore(data.risk_score);

        } catch (error) {
            console.error('Error fetching risk score:', error);
            alert(`Risk calculation failed: ${error.message}. Check API connection.`);
            setRiskScore(0); 
        }
    };

    useEffect(() => {
        fetchRiskScore();
    }, [envData]); 

    const riskLevel = getRiskLevel(riskScore || 0);

    
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
            {/* ... (Header aur Navigation Tabs ka code same rahega) ... */}
            <div className="container mx-auto px-4 py-8">
                 {/* Header */}
                 <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Leaf className="w-12 h-12 text-green-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-800">CropGuard AI</h1>
                    </div>
                    <p className="text-gray-600 text-lg">AI-Powered Crop Disease Detection & Management System</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('detect')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'detect' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Camera className="inline mr-2 w-5 h-5" />Detection
                        </button>
                        <button
                            onClick={() => setActiveTab('monitor')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'monitor' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <TrendingUp className="inline mr-2 w-5 h-5" />Risk Monitoring
                        </button>
                        <button
                            onClick={() => setActiveTab('database')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'database' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <FileText className="inline mr-2 w-5 h-5" />Disease Database
                        </button>
                    </div>
                </div>


                {/* Disease Detection Tab */}
                {activeTab === 'detect' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Crop Image for Analysis</h2>
                            <div className="mb-6">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md"/>
                                    ) : (
                                        <div><Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" /><p className="text-gray-600 font-medium mb-2">Click to upload crop image</p></div>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                            </div>
                            <button
                                onClick={analyzeCrop}
                                disabled={!selectedImage || loading}
                                className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${!selectedImage || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'}`}
                            >
                                {loading ? (<span className="flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>Analyzing...</span>) : ('Analyze Crop Image')}
                            </button>

                            {/* Prediction Results (Using Backend Data: prediction.info) */}
                            {prediction && prediction.info && (
                                <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        {prediction.info.severity === 'None (कुछ नहीं)' ? (<CheckCircle className="w-8 h-8 text-green-600 mr-3" />) : (<AlertTriangle className="w-8 h-8 text-red-600 mr-3" />)}
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{prediction.info.crop}: {prediction.info.disease_name}</h3>
                                            <p className="text-gray-600">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-lg p-4">
                                            <h4 className="font-bold text-gray-800 mb-2">Symptoms (लक्षण):</h4>
                                            <p className="text-gray-700">{prediction.info.symptoms}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4">
                                            <h4 className="font-bold text-gray-800 mb-2">Treatment Recommendations (इलाज के सुझाव):</h4>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                                {prediction.info.treatment.map((item, idx) => (<li key={idx}>{item}</li>))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Risk Monitoring Tab (Uses API Call 2) */}
                {activeTab === 'monitor' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Environmental Risk Assessment</h2>

                            {/* Risk Score Display */}
                            <div className={`${riskLevel.bg} rounded-xl p-6 mb-8`}>
                                <div className="text-center">
                                    <p className="text-gray-600 mb-2">Current Risk Level</p>
                                    <div className={`text-6xl font-bold ${riskLevel.color} mb-2`}>{riskScore}%</div>
                                    <span className={`inline-block px-6 py-2 rounded-full font-bold text-xl ${riskLevel.color} bg-white`}>{riskLevel.level} Risk</span>
                                </div>
                            </div>

                            {/* Environmental Parameters (Sliders) */}
                            <div className="space-y-6">
                                {/* Temperature */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center mb-4"><Thermometer className="w-6 h-6 text-red-500 mr-3" /><label className="font-bold text-gray-800">Temperature (°C): {envData.temperature}°C</label></div>
                                    <input type="range" min="10" max="45" value={envData.temperature} onChange={(e) => setEnvData({ ...envData, temperature: parseInt(e.target.value) })} className="w-full h-3 bg-gradient-to-r from-blue-400 via-green-400 to-red-500 rounded-lg appearance-none cursor-pointer"/>
                                </div>
                                {/* Humidity */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center mb-4"><Droplets className="w-6 h-6 text-blue-500 mr-3" /><label className="font-bold text-gray-800">Humidity (%): {envData.humidity}%</label></div>
                                    <input type="range" min="20" max="100" value={envData.humidity} onChange={(e) => setEnvData({ ...envData, humidity: parseInt(e.target.value) })} className="w-full h-3 bg-gradient-to-r from-yellow-300 to-blue-500 rounded-lg appearance-none cursor-pointer"/>
                                </div>
                                {/* Rainfall */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center mb-4"><Wind className="w-6 h-6 text-gray-500 mr-3" /><label className="font-bold text-gray-800">Rainfall (mm/day): {envData.rainfall}mm</label></div>
                                    <input type="range" min="0" max="20" value={envData.rainfall} onChange={(e) => setEnvData({ ...envData, rainfall: parseInt(e.target.value) })} className="w-full h-3 bg-gradient-to-r from-gray-300 to-blue-600 rounded-lg appearance-none cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Disease Database Tab (Static display, for simplicity using a dummy fetch or direct data) */}
                {activeTab === 'database' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Comprehensive Disease Database (Sample Data)</h2>
                            <p className="text-gray-600 mb-4">Note: In a real application, this data would also be fetched from the Python API.</p>
                             {/* Static display for demo purposes */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(DISEASE_INFO).map(([key, info]) => (
                                    <div key={key} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
                                        <h3 className="font-bold text-lg text-gray-800">{info.crop}: {info.disease_name}</h3>
                                        <p className="text-gray-600 font-medium">Severity: {info.severity}</p>
                                        <p className="text-sm mt-3"><span className="font-semibold">Key Treatment:</span> {info.treatment[0]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropDiseaseSystem;

const DISEASE_INFO = { /* Copy a small version of the dict here for database tab to avoid complex fetch logic */
    'cashew_anthracnose': {
        'crop': 'Cashew (काजू)', 'disease_name': 'Anthracnose (एन्थ्रेक्नोज)', 'severity': 'High (उच्च)',
        'symptoms': 'Patton (leaves) aur phal (fruits) par gehre bhoore (dark brown) ya kaale dhabbe (spots).',
        'treatment': ['Copper-based fungicide ka chhidkao karein.']
    },
    'cassava_mosaic': {
        'crop': 'Cassava (कसावा)', 'disease_name': 'Mosaic Virus (मोज़ेक वायरस)', 'severity': 'Very High (bahut zyada)',
        'symptoms': 'Patton par pila-hara (yellow-green) Mosaic pattern aur fasal ka chhota reh jaana (stunting).',
        'treatment': ['Koi chemical ilaaj nahin hai.']
    },
    'healthy': {
        'crop': 'Various (विभिन्न)', 'disease_name': 'Healthy Plant (स्वस्थ पौधा)', 'severity': 'None (कुछ नहीं)',
        'symptoms': 'Koi bimari ke lakshan nahin hain.',
        'treatment': ['Regular nigrani (monitoring) jaari rakhein.']
    }
};