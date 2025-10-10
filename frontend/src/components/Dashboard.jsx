import React, { useState, /*useEffect*/ } from 'react';
import Navbar from './Navbar.jsx';
import TextPrediction from './TextPrediction.jsx';
import ImagePrediction from './ImagePrediction.jsx';
import Results from './Results.jsx';
import Footer from './Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Separator } from './ui/separator.jsx';
import { diseaseDatabase } from '../diseaseData.js';

const Dashboard = () => {
  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictionResult = (apiResult) => {
    const resultKey = apiResult.Predicted_label || apiResult.predicted_class;

    const diseaseDetails = diseaseDatabase[resultKey];

    if (diseaseDetails) {
      const formattedResult = {
        ...apiResult,       // Copy original 'type' and 'input'
        ...diseaseDetails,  // Copy 'disease', 'description', 'treatment', etc.
        confidence: 90     // Add a default confidence score
      };
      setPredictionResults(formattedResult);
    } else {
      // Fallback if the disease is not in our database
      console.error("Error: Disease details not found for key:", resultKey);
      setPredictionResults({
        type: apiResult.type,
        input: apiResult.input,
        disease: resultKey || "Unknown Condition",
        description: "Detailed information for this condition is not available in our database.",
        treatment: { immediate: ["Consult a local agricultural expert."], prevention: ["Ensure proper plant care."] },
        confidence: 90,
        severity: "Unknown"
      });
    }
  };

  const handleLoadingState = (loading) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
    
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-1">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Plant Doc</span>
          </h1>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto">
          <p className="mb-4">
            Advanced AI-Powered Plant Disease Detection System
            </p>
            <p>Describe symptoms or Upload images to get instant diagnosis and treatment recommendations
          </p>
        </div>
        </div>

        {/* Text Prediction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="backdrop-blur-sm bg-white/70 shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 text-center ">
                Text-Based Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TextPrediction 
                onResult={handlePredictionResult} 
                onLoading={handleLoadingState}
              />
            </CardContent>
          </Card>

          {/* Image Prediction Section */}
          <Card className="backdrop-blur-sm bg-white/70 shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 text-center">
                Image-Based Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImagePrediction 
                onResult={handlePredictionResult} 
                onLoading={handleLoadingState}
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {(predictionResults || isLoading) && (
          <>
            <Separator className="my-8" />
            <Card className="backdrop-blur-sm bg-white/70 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-900">Prediction Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Results results={predictionResults} isLoading={isLoading} />
              </CardContent>
            </Card>
          </>
        )}
      {/* </main> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;