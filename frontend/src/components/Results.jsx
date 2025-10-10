import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Progress } from './ui/progress.jsx';
import { Separator } from './ui/separator.jsx';
import { CheckCircle, AlertTriangle, Info, FileText, Image } from 'lucide-react';

const Results = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your plant data...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No predictions yet. Use text or image prediction above to get started.</p>
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (confidence) => {
    if (confidence >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Input Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {results.type === 'text' ? <FileText className="h-5 w-5" /> : <Image className="h-5 w-5" />}
            Analysis Input ({results.type === 'text' ? 'Text-Based' : 'Image-Based'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.type === 'text' ? (
            <div className="space-y-2">
              <p><strong>Plant Type:</strong> {results.input.plantType}</p>
              <p><strong>Symptoms:</strong> {results.input.symptoms}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Image:</strong> {results.input.fileName}</p>
              <p><strong>Size:</strong> {(results.input.fileSize / 1024).toFixed(1)} KB</p>
              {results.input.imagePreview && (
                <img
                  src={results.input.imagePreview}
                  alt="Analyzed plant"
                  className="max-w-32 h-32 object-cover rounded-lg border"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Prediction Result */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Disease Prediction</span>
            {getStatusIcon(results.confidence)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{results.disease}</h3>
            <Badge variant={results.confidence >= 80 ? 'default' : 'secondary'} className="text-lg px-3 py-1">
              {results.severity}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Confidence Score</span>
              <span className={`font-bold ${getConfidenceColor(results.confidence)}`}>
                {results.confidence}%
              </span>
            </div>
            <Progress value={results.confidence} className="h-3" />
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-700">{results.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-green-700">Treatment Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">Immediate Actions</h4>
              <ul className="space-y-1">
                {results.treatment.immediate.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">Long-term Prevention</h4>
              <ul className="space-y-1">
                {results.treatment.prevention.map((prevention, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{prevention}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;