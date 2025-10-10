import React, { useState, useRef } from 'react';
import { Button } from './ui/button.jsx';
import { Label } from './ui/label.jsx';
import { Upload, Image, X, Camera } from 'lucide-react';
import { api } from '../api.js';
import { useToast } from '../hooks/use-toast';

const ImagePrediction = ({ onResult, onLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select a plant leaf image to analyze.",
        variant: "destructive",
      });
      return;
    }

    onLoading(true);
    
    // Simulate API call 
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const { data } = await api.post('/image-prediction', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
    const resultForDashboard = {
      Predicted_label: data.predicted_class, 
      type: 'image',
      input: {
        fileName: selectedImage.name,
        fileSize: selectedImage.size,
        imagePreview
      }
    };
    
    onResult(resultForDashboard);
      toast({
        title: "Analysis Complete",
        description: "Image-based prediction has been generated.",
      });

    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive"
      });
    } finally {
      onLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
        <Camera className="h-5 w-5" />
        <span className="font-medium">Upload a plant leaf image</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="imageUpload">Plant Leaf Image</Label>

          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Selected plant leaf"
                    className="max-w-full max-h-48 object-contain rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Image className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full flex justify-center items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 py-3 rounded-lg text-white"
          disabled={!selectedImage}
        >
          <Upload className="h-4 w-4 mr-2" />
          Analyze Image
        </Button>
      </form>
    </div>
  );
};

export default ImagePrediction;