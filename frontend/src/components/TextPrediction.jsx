import React, { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Label } from './ui/label.jsx';
import { Textarea } from './ui/textarea.jsx';
import { FileText, Send } from 'lucide-react';
import { api } from '../api.js';
import { useToast } from '../hooks/use-toast';

const TextPrediction = ({ onResult, onLoading }) => {
  const [plantType, setPlantType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const { toast } = useToast();

  const plantTypes = [
    'Tomato', 'Potato', 'Pepper', 'Corn', 'Wheat', 'Rice', 'Apple', 'Grape',
    'Citrus', 'Strawberry', 'Cucumber', 'Bean', 'Pea', 'Carrot', 'Lettuce'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered:", { plantType, symptoms });

    if (!plantType || !symptoms) {
      toast({
        title: "Missing Information",
        description: "Please select a plant type and describe symptoms.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      onLoading(true);
      
      // STEP 1: Combine plantType and symptoms into a single string.
      const combinedText = `The plant is ${plantType}. The symptoms are: ${symptoms}`;

      // STEP 2: Create a payload object with the 'text' key that the backend expects.
      const payload = {
        text: combinedText,
      };

      console.log("Sending this payload to backend:", payload); // For debugging

      // STEP 3: Send the correct payload to the API.
      const { data } = await api.post('/text-prediction', payload);
      
      console.log("API Response:", data);

      onResult({
        ...data,
        type: 'text',
        // We can still show the original input to the user
        input: { plantType, symptoms }, 
      });

      toast({
        title: "Analysis Complete",
        description: "Text-based prediction has been generated.",
      });

    } catch (error) {
      console.error("Prediction Failed:", error);
      toast({
        title: "Prediction Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      onLoading(false);
    }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
        <FileText className="h-5 w-5" />
        <span className="font-medium">Describe your plant's condition</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="plantType">Plant Type</Label>

          <select
            id="plantType"
            value={plantType}
            onChange={(e) => setPlantType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white"
          >
            <option value="" disabled>Select plant type</option>
            {plantTypes.map((plant) => (
              <option key={plant} value={plant}>
                {plant}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="symptoms">Symptoms Description</Label>
          <Textarea
            id="symptoms"
            placeholder="Describe the symptoms you observe (e.g., yellow leaves, brown spots, wilting, etc.)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full flex justify-center items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 py-3 rounded-lg text-white"
          disabled={!plantType || !symptoms}
        >
          Analyze Symptoms
          <Send className="h-4 w-4 ml-2" />
          
        </Button>
      </form>
    </div>
  );
};

export default TextPrediction;