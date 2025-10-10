// Mock data for disease predictions

const diseases = {
  fungal: [
    {
      name: 'Early Blight',
      severity: 'Moderate',
      description: 'A common fungal disease causing dark spots with concentric rings on leaves. Often occurs in warm, humid conditions.',
      confidence: 85,
      treatment: {
        immediate: [
          'Remove affected leaves immediately',
          'Apply copper-based fungicide spray',
          'Improve air circulation around plants',
          'Avoid watering leaves directly'
        ],
        prevention: [
          'Practice crop rotation',
          'Use disease-resistant varieties',
          'Maintain proper plant spacing',
          'Apply mulch to prevent soil splashing'
        ]
      }
    },
    {
      name: 'Powdery Mildew',
      severity: 'Mild',
      description: 'A fungal disease that appears as white powdery coating on leaves and stems. Thrives in dry conditions with high humidity.',
      confidence: 78,
      treatment: {
        immediate: [
          'Spray with neem oil solution',
          'Remove heavily infected parts',
          'Increase air circulation',
          'Apply baking soda spray (1 tsp per quart water)'
        ],
        prevention: [
          'Plant in sunny locations',
          'Avoid overhead watering',
          'Choose resistant varieties',
          'Maintain proper plant spacing'
        ]
      }
    },
    {
      name: 'Late Blight',
      severity: 'Severe',
      description: 'A devastating disease causing water-soaked lesions that quickly turn brown and black. Can destroy entire plants rapidly.',
      confidence: 92,
      treatment: {
        immediate: [
          'Remove and destroy infected plants immediately',
          'Apply copper fungicide preventively',
          'Improve drainage and air circulation',
          'Avoid working with wet plants'
        ],
        prevention: [
          'Use certified disease-free seeds',
          'Practice strict sanitation',
          'Avoid overhead irrigation',
          'Monitor weather conditions closely'
        ]
      }
    }
  ],
  bacterial: [
    {
      name: 'Bacterial Spot',
      severity: 'Moderate',
      description: 'Bacterial infection causing small, dark spots with yellow halos on leaves. Can affect fruit quality.',
      confidence: 82,
      treatment: {
        immediate: [
          'Apply copper bactericide spray',
          'Remove infected plant debris',
          'Avoid overhead watering',
          'Disinfect tools between plants'
        ],
        prevention: [
          'Use pathogen-free seeds',
          'Practice crop rotation',
          'Maintain proper plant spacing',
          'Control insect vectors'
        ]
      }
    },
    {
      name: 'Bacterial Wilt',
      severity: 'Severe',
      description: 'A serious bacterial disease causing rapid wilting and death of plants. Spreads through vascular system.',
      confidence: 88,
      treatment: {
        immediate: [
          'Remove and destroy infected plants',
          'Disinfect tools and equipment',
          'Improve soil drainage',
          'Control cucumber beetles (vectors)'
        ],
        prevention: [
          'Use resistant varieties',
          'Practice crop rotation',
          'Control insect vectors',
          'Maintain soil health'
        ]
      }
    }
  ],
  viral: [
    {
      name: 'Mosaic Virus',
      severity: 'Moderate',
      description: 'Viral infection causing mottled, mosaic-like patterns on leaves. Can stunt plant growth and reduce yield.',
      confidence: 75,
      treatment: {
        immediate: [
          'Remove infected plants immediately',
          'Control aphid populations',
          'Disinfect tools with bleach solution',
          'Avoid handling wet plants'
        ],
        prevention: [
          'Use virus-free seeds',
          'Control aphid vectors',
          'Remove weeds that harbor viruses',
          'Practice good sanitation'
        ]
      }
    }
  ],
  nutritional: [
    {
      name: 'Nitrogen Deficiency',
      severity: 'Mild',
      description: 'Nutritional disorder causing yellowing of older leaves first. Plants may appear stunted with reduced growth.',
      confidence: 70,
      treatment: {
        immediate: [
          'Apply nitrogen-rich fertilizer',
          'Use compost or organic matter',
          'Check soil pH levels',
          'Ensure proper watering'
        ],
        prevention: [
          'Regular soil testing',
          'Balanced fertilization program',
          'Organic matter incorporation',
          'Proper crop rotation'
        ]
      }
    },
    {
      name: 'Potassium Deficiency',
      severity: 'Moderate',
      description: 'Nutrient deficiency causing leaf edges to turn brown and curl. Affects plant vigor and disease resistance.',
      confidence: 73,
      treatment: {
        immediate: [
          'Apply potassium sulfate fertilizer',
          'Use wood ash (if soil is not alkaline)',
          'Improve soil drainage',
          'Check irrigation practices'
        ],
        prevention: [
          'Regular soil analysis',
          'Balanced fertilization',
          'Maintain proper soil pH',
          'Use organic potassium sources'
        ]
      }
    }
  ]
};

const getRandomDisease = () => {
  const categories = Object.keys(diseases);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const categoryDiseases = diseases[randomCategory];
  return categoryDiseases[Math.floor(Math.random() * categoryDiseases.length)];
};

const getContextualDisease = (plantType, symptoms) => {
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Simple keyword matching for more realistic results
  if (lowerSymptoms.includes('yellow') && lowerSymptoms.includes('leaves')) {
    if (lowerSymptoms.includes('spots') || lowerSymptoms.includes('ring')) {
      return diseases.fungal[0]; // Early Blight
    }
    return diseases.nutritional[0]; // Nitrogen Deficiency
  }
  
  if (lowerSymptoms.includes('white') && lowerSymptoms.includes('powder')) {
    return diseases.fungal[1]; // Powdery Mildew
  }
  
  if (lowerSymptoms.includes('brown') && lowerSymptoms.includes('spots')) {
    return diseases.bacterial[0]; // Bacterial Spot
  }
  
  if (lowerSymptoms.includes('wilt') || lowerSymptoms.includes('drooping')) {
    return diseases.bacterial[1]; // Bacterial Wilt
  }
  
  if (lowerSymptoms.includes('mosaic') || lowerSymptoms.includes('mottled')) {
    return diseases.viral[0]; // Mosaic Virus
  }
  
  if (lowerSymptoms.includes('edge') && lowerSymptoms.includes('brown')) {
    return diseases.nutritional[1]; // Potassium Deficiency
  }
  
  // Default to a random disease if no keywords match
  return getRandomDisease();
};

export const mockTextPrediction = (plantType, symptoms) => {
  const disease = getContextualDisease(plantType, symptoms);
  
  return {
    disease: disease.name,
    severity: disease.severity,
    confidence: disease.confidence + Math.floor(Math.random() * 10) - 5, // Add some variation
    description: disease.description,
    treatment: disease.treatment
  };
};

export const mockImagePrediction = (fileName) => {
  const disease = getRandomDisease();
  
  // Image predictions tend to be more confident
  const confidenceBoost = Math.floor(Math.random() * 15) + 5;
  
  return {
    disease: disease.name,
    severity: disease.severity,
    confidence: Math.min(95, disease.confidence + confidenceBoost),
    description: disease.description + ' This diagnosis is based on visual analysis of the uploaded leaf image.',
    treatment: disease.treatment
  };
};

export default {
  mockTextPrediction,
  mockImagePrediction
};