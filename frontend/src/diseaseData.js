export const diseaseDatabase = {
  // Pepper Diseases
  "Pepper__bell___Bacterial_spot": {
    disease: "Pepper - Bacterial Spot",
    severity: "High",
    description: "This disease causes small, water-soaked spots on leaves that turn dark and greasy. It can also affect stems and fruit, leading to significant crop loss.",
    treatment: {
      immediate: [
        "Remove and destroy infected plants to prevent spread.",
        "Apply copper-based fungicides/bactericides immediately.",
        "Avoid working with plants when they are wet."
      ],
      prevention: [
        "Plant disease-resistant varieties whenever possible.",
        "Practice crop rotation; do not plant peppers or tomatoes in the same spot for at least two years.",
        "Ensure proper spacing for good air circulation."
      ]
    }
  },
  "Pepper__bell___healthy": {
    disease: "Pepper - Healthy",
    severity: "None",
    description: "The plant shows no signs of disease. The leaves are a vibrant green, and the stem is strong. Continue with good care practices.",
    treatment: {
      immediate: ["No immediate action needed."],
      prevention: [
        "Maintain a consistent watering schedule.",
        "Provide adequate nutrients through balanced fertilizer.",
        "Regularly monitor for pests and early signs of disease."
      ]
    }
  },

  // Potato Diseases
  "Potato___Early_blight": {
    disease: "Potato - Early Blight",
    severity: "Moderate",
    description: "Characterized by small, dark lesions, often with a 'target-like' ring pattern on lower leaves. The affected leaves may turn yellow and die.",
    treatment: {
      immediate: [
        "Prune and dispose of affected lower leaves.",
        "Apply a fungicide containing mancozeb or chlorothalonil.",
        "Ensure the plant is not water-stressed."
      ],
      prevention: [
        "Use certified disease-free potato seeds.",
        "Maintain good soil fertility and moisture.",
        "Rotate crops and remove volunteer potato plants."
      ]
    }
  },
  "Potato___Late_blight": {
    disease: "Potato - Late Blight",
    severity: "High",
    description: "A very destructive disease causing large, dark, water-soaked spots on leaves and stems. A white mold may appear on the underside of leaves.",
    treatment: {
      immediate: [
        "Destroy infected plants and tubers immediately to prevent rapid spread.",
        "Apply targeted fungicides aggressively as per local recommendations.",
        "Halt irrigation to reduce humidity."
      ],
      prevention: [
        "Plant resistant varieties.",
        "Ensure good drainage and air circulation.",
        "Monitor weather forecasts for conditions favorable to blight (cool, moist weather)."
      ]
    }
  },
  "Potato___healthy": {
    disease: "Potato - Healthy",
    severity: "None",
    description: "The potato plant is thriving with lush green foliage and no visible lesions or wilting. Continue with standard care.",
    treatment: {
      immediate: ["No action is necessary."],
      prevention: [
        "Ensure consistent hilling to protect tubers from sunlight.",
        "Manage pests like the Colorado potato beetle.",
        "Maintain a regular watering and feeding schedule."
      ]
    }
  },

  // Tomato Diseases
  "Tomato_Bacterial_spot": {
    disease: "Tomato - Bacterial Spot",
    severity: "Moderate",
    description: "Identified by small, angular, water-soaked spots on leaves and fruit. The spots may have a yellow halo and can feel slightly raised on fruit.",
    treatment: {
      immediate: [
        "Remove and destroy infected plant parts.",
        "Apply copper-based bactericides.",
        "Avoid overhead watering; use drip irrigation if possible."
      ],
      prevention: [
        "Use disease-free seeds and transplants.",
        "Practice a 3-year crop rotation away from peppers and tomatoes.",
        "Keep weeds under control as they can host the bacteria."
      ]
    }
  },
  "Tomato_Early_blight": {
    disease: "Tomato - Early Blight",
    severity: "Moderate",
    description: "Symptoms appear on older, lower leaves as small, brown lesions with a distinct 'bull's-eye' pattern. Leaves turn yellow and drop.",
    treatment: {
      immediate: [
        "Prune affected leaves and stems.",
        "Apply fungicides like chlorothalonil or mancozeb.",
        "Mulch around the base of the plant to prevent soil splash."
      ],
      prevention: [
        "Plant resistant varieties.",
        "Ensure proper plant spacing for air circulation.",
        "Stake or cage plants to keep them off the ground."
      ]
    }
  },
  "Tomato_Late_blight": {
    disease: "Tomato - Late Blight",
    severity: "High",
    description: "Causes large, irregular, greasy-looking, grayish-green spots on leaves that can rapidly expand and kill the plant. Fruit can develop large, firm, brown spots.",
    treatment: {
      immediate: [
        "Remove and bag infected plants immediately. Do not compost.",
        "Apply preventative and curative fungicides.",
        "This disease spreads very fast; quick action is crucial."
      ],
      prevention: [
        "Plant resistant cultivars.",
        "Space plants far apart to promote drying.",
        "Avoid watering in the late afternoon or evening."
      ]
    }
  },
  "Tomato_Leaf_Mold": {
    disease: "Tomato - Leaf Mold",
    severity: "Moderate",
    description: "Symptoms include pale green or yellowish spots on the upper leaf surface, with a corresponding velvety, olive-green mold on the underside.",
    treatment: {
      immediate: [
        "Improve air circulation by pruning lower leaves and spacing plants.",
        "Reduce humidity, especially in greenhouses.",
        "Apply an appropriate fungicide."
      ],
      prevention: [
        "Use resistant varieties.",
        "Ensure adequate ventilation.",
        "Water the soil directly, not the leaves."
      ]
    }
  },
  "Tomato_Septoria_leaf_spot": {
    disease: "Tomato - Septoria Leaf Spot",
    severity: "Moderate",
    description: "Causes numerous small, circular spots with dark borders and tan or gray centers on lower leaves. Small black dots (fruiting bodies) can be seen in the center of spots.",
    treatment: {
      immediate: [
        "Remove infected leaves as soon as they appear.",
        "Apply fungicides containing chlorothalonil or mancozeb.",
        "Mulch heavily to cover the soil."
      ],
      prevention: [
        "Practice good sanitation and crop rotation.",
        "Control weeds, as some can host the fungus.",
        "Water at the base of the plant."
      ]
    }
  },
  "Tomato_Spider_mites_Two_spotted_spider_mite": {
    disease: "Tomato - Spider Mites",
    severity: "High",
    description: "Infestation causes yellow stippling on leaves as mites feed on plant cells. Fine webbing may be visible on the underside of leaves. Severe infestations can kill the plant.",
    treatment: {
      immediate: [
        "Spray plants with a strong jet of water to dislodge mites.",
        "Apply insecticidal soap or horticultural oil, focusing on the underside of leaves.",
        "Consider introducing predatory mites as a biological control."
      ],
      prevention: [
        "Keep plants well-watered to reduce stress.",
        "Regularly inspect the underside of leaves for signs of mites.",
        "Increase humidity, as mites thrive in dry conditions."
      ]
    }
  },
  "Tomato__Target_Spot": {
    disease: "Tomato - Target Spot",
    severity: "Moderate",
    description: "Lesions are brown to black with distinct concentric rings, similar to Early Blight but often smaller and more numerous. Can also infect stems and fruit.",
    treatment: {
      immediate: [
        "Remove and destroy infected plant debris.",
        "Improve air circulation through pruning.",
        "Apply fungicides such as chlorothalonil or copper-based products."
      ],
      prevention: [
        "Practice crop rotation.",
        "Avoid overhead irrigation.",
        "Stake plants to keep foliage off the ground."
      ]
    }
  },
  "Tomato__Tomato_YellowLeaf__Curl_Virus": {
    disease: "Tomato - Yellow Leaf Curl Virus",
    severity: "High",
    description: "A viral disease transmitted by whiteflies. Symptoms include yellowing and upward curling of leaves, stunted growth, and reduced fruit production.",
    treatment: {
      immediate: [
        "There is no cure. Remove and destroy infected plants immediately to prevent spread.",
        "Control whitefly populations with insecticides or yellow sticky traps.",
      ],
      prevention: [
        "Plant virus-resistant varieties.",
        "Use reflective mulch to deter whiteflies.",
        "Install insect netting in greenhouses or gardens."
      ]
    }
  },
  "Tomato__Tomato_mosaic_virus": {
    disease: "Tomato - Mosaic Virus",
    severity: "High",
    description: "Causes a mosaic-like pattern of light green and yellow areas on leaves. Leaves may be malformed, and plants can be stunted.",
    treatment: {
      immediate: [
        "There is no cure for viral diseases. Infected plants should be removed and destroyed.",
        "Wash hands and tools thoroughly after handling infected plants.",
      ],
      prevention: [
        "Plant resistant varieties.",
        "Control insects that can transmit the virus.",
        "Avoid using tobacco products near plants, as the virus can be transmitted from them."
      ]
    }
  },
  "Tomato_healthy": {
    disease: "Tomato - Healthy",
    severity: "None",
    description: "The plant is healthy, showing vigorous growth, normal leaf color, and good fruit development. No signs of disease or pests are present.",
    treatment: {
      immediate: ["No action needed, plant is healthy."],
      prevention: [
        "Continue to provide consistent water and nutrients.",
        "Prune suckers to encourage airflow and direct energy to fruit.",
        "Monitor regularly for any issues."
      ]
    }
  }
};