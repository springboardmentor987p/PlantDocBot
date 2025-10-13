# -*- coding: utf-8 -*-
"""main.py

FastAPI application for plant disease prediction using the newCNN and Text Classification models.
"""
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch

from models.model import newCNN
from torchvision import transforms
from PIL import Image
from io import BytesIO
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from fastapi.middleware.cors import CORSMiddleware
import torch.nn.functional as F

# --- Device Configuration ---
device = "cuda" if torch.cuda.is_available() else "cpu" 

# --- IMAGE CLASSIFICATION CONFIG (15 Classes) ---
IMAGE_CLASSES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

NUM_IMAGE_CLASSES = len(IMAGE_CLASSES)

mean = [0.4487] 
std = [0.1831]

image_transform = transforms.Compose([
    transforms.Resize((128, 128)), 
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])

# --- TEXT CLASSIFICATION CONFIG ---
TEXT_CLASSES = {
    0: "Pepper bell Bacterial spot", 1: "Pepper bell healthy", 
    2: "Potato Early blight", 3: "Potato Late blight", 
    4: "Potato healthy", 5: "Tomato Bacterial spot", 
    6: "Tomato Early blight", 7: "Tomato Late blight", 
    8: "Tomato Leaf Mold", 9: "Tomato Septoria leaf spot", 
    10: "Tomato Spider mites Two spotted spider mite", 11: "Tomato Target Spot", 
    12: "Tomato YellowLeaf Curl Virus", 13: "Tomato healthy", 
    14: "Tomato mosaic virus",
    
}
NUM_TEXT_CLASSES = len(TEXT_CLASSES)
TEXT_MODEL_ARTIFACTS_DIR = "text_model_artifacts"
MAX_SEQ_LENGTH = 256

# --- Model Loading (Image Model) ---
image_model = newCNN(NUM_IMAGE_CLASSES)
IMAGE_LOADED = False
IMAGE_MODEL_PATH = "plant_cnn.pth"
PREDICTION_AVAILABLE = False

try:
    image_model.load_state_dict(torch.load(IMAGE_MODEL_PATH, map_location=device))
    image_model.to(device)
    image_model.eval()
    IMAGE_LOADED = True
    PREDICTION_AVAILABLE = True
    print(f"Image model loaded successfully from {IMAGE_MODEL_PATH} on device: {device}")
except FileNotFoundError:
    print(f"ERROR: Image model weights file '{IMAGE_MODEL_PATH}' not found. Image endpoint is disabled.")
except RuntimeError as e:
    print(f"ERROR: Image Model Loading Failed. Reason: {e}") 
    print("HINT: Ensure models/model.py defines the exact architecture (layers, shapes) used during training.")

# --- Model Loading (Text Model) ---
text_model = None
text_tokenizer = None
TEXT_LOADED = False

try:
    text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_ARTIFACTS_DIR)
    text_tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_ARTIFACTS_DIR)
    text_model.to(device)
    text_model.eval()
    TEXT_LOADED = True
    print(f"Text model loaded successfully from {TEXT_MODEL_ARTIFACTS_DIR} on device: {device}")
except Exception as e:
    print(f"ERROR: Text Model Loading Failed. Reason: {e}")
    print("HINT: Ensure the 'text_model_artifacts' folder is present and contains all required Hugging Face files.")

recommendations = {
    'Pepper bell Bacterial spot': 'Remove affected leaves and apply appropriate bactericides.',
    'Pepper bell healthy': 'No action needed. Plant is healthy.',
    'Potato Early blight': 'Remove infected leaves and use recommended fungicides.',
    'Potato Late blight': 'Destroy infected plants and avoid overhead irrigation.',
    'Tomato Bacterial spot': 'Remove affected leaves and apply copper-based bactericides.',
    'Potato healthy': 'No action needed. Plant is healthy.',
    'Tomato Late blight': 'Remove and destroy infected plants. Use fungicides as recommended.',
    'Tomato Early blight': 'Remove infected leaves and apply fungicides.',
    'Tomato Leaf Mold': 'Increase air circulation and apply appropriate fungicides.',
    'Tomato Septoria leaf spot': 'Remove affected leaves and avoid wetting foliage.',
    'Tomato Spider mites Two spotted spider mite': 'Use miticides and increase humidity around plants.',
    'Tomato Target Spot': 'Remove infected leaves and apply fungicides.',
    'Tomato YellowLeaf Curl Virus': 'Control whiteflies and remove infected plants.',
    'Tomato mosaic virus': 'Remove infected plants and disinfect tools.',
    'Tomato healthy': 'No action needed. Plant is healthy.'
}

# --- FastAPI App Setup ---
app = FastAPI(title="Plant Doc Bot API", version="1.0.0")

origins = ["*"] 

# CORS Middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body structure for text prediction
class TextInput(BaseModel):
    text_input: str


@app.get("/")
def read_root():
    """Provides status information about the API and model availability."""
    return {
        "status": "Service operational",
        "image_model_loaded": IMAGE_LOADED,
        "text_model_loaded": TEXT_LOADED,
        "device": device
    }

@app.post("/image-prediction")
async def image_predict(file: UploadFile = File(...)):
    """Accepts an image file and returns the predicted plant disease class."""
    
    if not IMAGE_LOADED:
        return JSONResponse(
            status_code=503,
            content={"message": "Image Model weights are not available or failed to load. Prediction is disabled."}
        )
    
    try:
        # 1. Read the image file content
        image_data = await file.read()
        
        # 2. Open the image using PIL (Convert to Grayscale for 1-channel model)
        image = Image.open(BytesIO(image_data)).convert("L")

        # 3. Transform the image for the model
        image_tensor = image_transform(image).unsqueeze(0).to(device)

        # 4. Run inference
        with torch.inference_mode():
            output_tensor = image_model(image_tensor)
            
            # Get the confidence and predicted index
            probabilities = F.softmax(output_tensor, dim=1)[0]
            predication_idx = torch.argmax(output_tensor, dim=1).item()
            prediction_class = IMAGE_CLASSES[predication_idx]
            confidence = probabilities[predication_idx].item()
            recommendation = recommendations.get(prediction_class, "No recommendation available.")
            
        return {
            "predicted_class": prediction_class,
            "confidence": f"{confidence:.4f}",
            "model_version": "newCNN (Grayscale 128x128)",
            "recommendation": recommendation
        }
    
    except Exception as e:
        # Handle general prediction errors (e.g., bad image file)
        return JSONResponse(
            status_code=500,
            content={"message": f"Image prediction failed due to an internal error: {e}"}
        )

@app.post("/text-prediction")
async def text_predict(data: TextInput):
    """Accepts a string of text and returns the predicted plant disease class."""

    if not TEXT_LOADED:
        return JSONResponse(
            status_code=503,
            content={"message": "Text Model weights are not available or failed to load. Prediction is disabled."}
        )

    try:
        # 1. Tokenize the input text
        encoding = text_tokenizer.encode_plus(
            data.text_input,
            add_special_tokens=True,
            max_length=MAX_SEQ_LENGTH,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt', # Return PyTorch tensors
        )

        input_ids = encoding['input_ids'].to(device)
        attention_mask = encoding['attention_mask'].to(device)
        
        # 2. Run inference
        with torch.no_grad():
            output = text_model(input_ids, attention_mask=attention_mask)
        
        # 3. Get prediction
        logits = output.logits
        probabilities = F.softmax(logits, dim=1)[0]
        prediction_idx = torch.argmax(logits, dim=1).item()
        prediction_class = TEXT_CLASSES[prediction_idx]
        confidence = probabilities[prediction_idx].item()
        recommendation = recommendations.get(prediction_class, "No recommendation available.")

        return {
            "predicted_class": prediction_class,
            "confidence": f"{confidence:.4f}",
            "model_version": "DistilBERT (38 Classes)",
            "recommendation": recommendation
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Text prediction failed due to an internal error: {e}"}
        )


