const { useState, useCallback, useMemo } = React;

// Define the base URL for the FastAPI backend
const API_BASE_URL = 'http://127.0.0.1:8000';

function UploadIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto text-indigo-500 mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 18H17.25a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v8.55C4.5 15.6 5.518 16.5 6.75 16.5z" />
        </svg>
    );
}

function PlantDocApp() {
    const [activeTab, setActiveTab] = useState('image'); // 'image' or 'text'
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [result, setResult] = useState(null); // { predicted_class, confidence, model_version }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- State Reset Functions ---
    const resetState = useCallback(() => {
        setResult(null);
        setError(null);
        setLoading(false);
    }, []);

    const resetImage = useCallback(() => {
        setImageFile(null);
        setImagePreview(null);
        resetState();
    }, [resetState]);

    // --- Image Handling ---

    const handleImageChange = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            resetImage();
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setError("Please select a valid image file (.jpg, .png).");
        }
    }, [resetState]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        handleImageChange(file);
    }, [handleImageChange]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    // --- API Calls ---

    const checkApiHealth = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/`);
            if (!response.ok) throw new Error("Server not responding.");
            const data = await response.json();
            if (!data.image_model_loaded && activeTab === 'image') {
                throw new Error("Image Model not loaded. Check backend console.");
            }
            if (!data.text_model_loaded && activeTab === 'text') {
                 throw new Error("Text Model not loaded. Check backend console.");
            }
            return true;
        } catch (e) {
            setError(`API Server is Offline or model failed to load. Reason: ${e.message}`);
            setLoading(false);
            return false;
        }
    };

    const handleImageSubmit = async () => {
        if (!imageFile) {
            setError("Please upload an image before diagnosing.");
            return;
        }
        resetState();
        if (!(await checkApiHealth())) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch(`${API_BASE_URL}/image-prediction`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                // Check for 503 error returned from FastAPI when model is disabled
                if (response.status === 503 && data.message) {
                    throw new Error(`Server Error: ${data.message}`);
                }
                throw new Error(data.message || "Unknown prediction error.");
            }
        } catch (e) {
            setError(`Prediction failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTextSubmit = async () => {
        if (!textInput.trim()) {
            setError("Please enter symptom text before diagnosing.");
            return;
        }
        resetState();
        if (!(await checkApiHealth())) return;

        setLoading(true);
        setError(null);

        const payload = { text_input: textInput.trim() };

        try {
            const response = await fetch(`${API_BASE_URL}/text-prediction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                // Check for 503 error returned from FastAPI when model is disabled
                if (response.status === 503 && data.message) {
                    throw new Error(`Server Error: ${data.message}`);
                }
                throw new Error(data.message || "Unknown prediction error.");
            }
        } catch (e) {
            setError(`Prediction failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- UI Rendering ---

    const renderInput = () => {
        if (activeTab === 'image') {
            return (
                <div className="flex flex-col space-y-4">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => document.getElementById('image-upload').click()}
                        className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition duration-150 ${imageFile ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
                    >
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                            className="hidden"
                        />
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="max-h-64 w-full object-contain rounded-md mx-auto mb-3 border border-gray-200" />
                                <p className="text-sm font-medium text-gray-700">{imageFile.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Click or drop to change image.</p>
                            </>
                        ) : (
                            <>
                                <UploadIcon />
                                <p className="text-sm font-semibold text-gray-700">Drag & drop an image here</p>
                                <p className="text-xs text-gray-500">or click to browse (.jpg, .png)</p>
                            </>
                        )}
                    </div>
                    {imageFile && (
                        <button
                            onClick={handleImageSubmit}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
                        >
                            {loading ? 'Diagnosing...' : 'Diagnose from Image'}
                        </button>
                    )}
                </div>
            );
        } else {
            return (
                <div className="flex flex-col space-y-4">
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="e.g., The leaves are showing large, water-soaked spots with fuzzy edges..."
                        rows="6"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none"
                    ></textarea>
                    <button
                        onClick={handleTextSubmit}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
                    >
                        {loading ? 'Analyzing Text...' : 'Diagnose from Text'}
                    </button>
                </div>
            );
        }
    };

    const renderResult = useMemo(() => {
        if (loading) {
            return (
                <div className="flex items-center space-x-3 text-indigo-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="font-semibold">Processing Prediction...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-bold">Error:</p>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }

        if (result) {
            const confidencePercent = (parseFloat(result.confidence) * 100).toFixed(2);
            return (
                <div className="space-y-3 p-4 bg-white rounded-lg shadow-inner border border-green-200">
                    <h3 className="text-xl font-bold text-green-700 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Diagnosis Complete
                    </h3>
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                        <p className="text-sm font-semibold text-gray-600">Predicted Class:</p>
                        <p className="text-2xl font-extrabold text-indigo-700 break-words">
                            {result.predicted_class.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm font-semibold text-gray-600">Confidence:</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div
                                className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${confidencePercent}%` }}
                            ></div>
                        </div>
                        <p className="text-xl font-bold text-indigo-600">{confidencePercent}%</p>
                        <p className="text-xs text-gray-400 mt-2">Model: {result.model_version}</p>
                        {result.recommendation && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-semibold text-green-700">Recommendation:</p>
                                <p className="text-gray-700">{result.recommendation}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
                Awaiting diagnosis input...
            </div>
        );
    }, [loading, error, result]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
                
                {/* Header and Branding */}
                <header className="text-center py-4 bg-indigo-50 rounded-xl shadow-inner">
                    <h1 className="text-4xl font-extrabold text-indigo-700">PlantDoc Bot</h1>
                    <p className="text-gray-500 mt-1">AI Diagnostic: Protect Your Crops, Predict the Future.</p>
                </header>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <div className="bg-gray-50 p-5 rounded-xl shadow-md space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">1. Select Input Type</h2>
                        
                        {/* Tabs */}
                        <div className="flex space-x-2 p-1 bg-white rounded-lg shadow-sm">
                            <button
                                onClick={() => setActiveTab('image')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition duration-200 ${activeTab === 'image' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Image Upload / Drop
                            </button>
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition duration-200 ${activeTab === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Text Symptoms
                            </button>
                        </div>
                        
                        {/* Input Area */}
                        <div className="pt-2">
                            {renderInput()}
                        </div>
                    </div>

                    {/* Output Panel */}
                    <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">2. Prediction Results</h2>
                        <div className="pt-2 h-full">
                            {renderResult}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// FIX: Standardize rendering to use ReactDOM.createRoot for modern compatibility.
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<PlantDocApp />);
