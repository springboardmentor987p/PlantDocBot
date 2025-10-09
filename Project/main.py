# -*- coding: utf-8 -*-
"""
main.py

FastAPI application for plant disease prediction using newCNN (grayscale) 
and a Hugging Face text classification model, with static frontend serving.
"""
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from io import BytesIO
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import os

# --- Device Configuration ---
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- CORRECTED IMAGE MODEL ARCHITECTURE ---
# This class now matches the architecture from your saved .pth file.
class newCNN(nn.Module):
    def __init__(self, num_classes=15, in_channels=1):
        super(newCNN, self).__init__()
        # Convolutional Layer 1
        self.conv1 = nn.Conv2d(in_channels=in_channels, out_channels=16, kernel_size=3, stride=1, padding=1)
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        # After pool1 with 128x128 input -> 16 x 64 x 64 tensor

        # Convolutional Layer 2
        self.conv2 = nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, stride=1, padding=1)
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)
        # After pool2 with 64x64 input -> 32 x 32 x 32 tensor

        # Fully Connected Layers
        # Flattened size: 32 * 32 * 32 = 32768
        self.fc1 = nn.Linear(32768, 128)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        # Pass through conv layers
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.pool2(F.relu(self.conv2(x)))
        
        # Flatten the tensor for the fully connected layers
        x = x.view(-1, 32 * 32 * 32)
        
        # Pass through fully connected layers
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# --- IMAGE CLASSIFICATION CONFIG ---
IMAGE_CLASSES = {
    0: 'Pepperbell Bacterial spot',
    1: 'Pepperbell healthy',
    2: 'Potato Early blight',
    3: 'Potato Late blight',
    4: 'Tomato Bacterial spot',
    5: 'Potato healthy',
    6: 'Tomato Late blight',
    7: 'Tomato Early blight',
    8: 'Tomato Leaf Mold',
    9: 'Tomato Septoria leaf spot',
    10: 'Tomato Spider mites Two spotted spider mite',
    11: 'Tomato Target Spot',
    12: 'Tomato YellowLeaf Curl Virus',
    13: 'Tomato mosaic virus',
    14: 'Tomato healthy'
}
NUM_IMAGE_CLASSES = len(IMAGE_CLASSES)

# Image preprocessing for grayscale
image_transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])

# --- TEXT CLASSIFICATION CONFIG ---
TEXT_CLASSES = {
    0: "Pepper bell Bacterial spot",
    1: "Pepper bell healthy",
    2: "Potato Early blight",
    3: "Potato Late blight",
    4: "Potato healthy",
    5: "Tomato Bacterial spot",
    6: "Tomato Early blight",
    7: "Tomato Late blight",
    8: "Tomato Leaf Mold",
    9: "Tomato Septoria leaf spot",
    10: "Tomato Spider mites Two spotted spider mite",
    11: "Tomato Target Spot",
    12: "Tomato YellowLeaf Curl Virus",
    13: "Tomato healthy",
    14: "Tomato mosaic virus"
}
NUM_TEXT_CLASSES = len(TEXT_CLASSES)
TEXT_MODEL_ARTIFACTS_DIR = "text_model_artifacts"
MAX_SEQ_LENGTH = 256

# --- RECOMMENDATIONS ---
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

# --- LOAD IMAGE MODEL ---
image_model = newCNN(NUM_IMAGE_CLASSES, in_channels=1)  # Grayscale
IMAGE_MODEL_PATH = "plant_cnn.pth"
IMAGE_LOADED = False

try:
    image_model.load_state_dict(torch.load(IMAGE_MODEL_PATH, map_location=device))
    image_model.to(device)
    image_model.eval()
    IMAGE_LOADED = True
    print(f"✅ Image model loaded from {IMAGE_MODEL_PATH} on device {device}")
except FileNotFoundError:
    print(f"❌ Image model weights file '{IMAGE_MODEL_PATH}' not found.")
except Exception as e:
    print(f"❌ Image Model Loading Failed: {e}")

# --- LOAD TEXT MODEL ---
text_model = None
text_tokenizer = None
TEXT_LOADED = False

try:
    if os.path.exists(TEXT_MODEL_ARTIFACTS_DIR):
        text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_ARTIFACTS_DIR)
        text_tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_ARTIFACTS_DIR)
        text_model.to(device)
        text_model.eval()
        TEXT_LOADED = True
        print(f"✅ Text model loaded from {TEXT_MODEL_ARTIFACTS_DIR} on device {device}")
    else:
        print(f"❌ Text model directory '{TEXT_MODEL_ARTIFACTS_DIR}' not found.")
except Exception as e:
    print(f"❌ Text Model Loading Failed: {e}")

# --- FASTAPI APP SETUP ---
app = FastAPI(title="Plant Doc Bot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST BODY SCHEMA ---
class TextInput(BaseModel):
    text_input: str

# --- HEALTH CHECK ---
@app.get("/health")
def health_check():
    return {
        "status": "Service operational",
        "image_model_loaded": IMAGE_LOADED,
        "text_model_loaded": TEXT_LOADED,
        "device": device
    }

# --- IMAGE PREDICTION ENDPOINT ---
@app.post("/image-prediction")
async def image_predict(file: UploadFile = File(...)):
    if not IMAGE_LOADED:
        return JSONResponse(status_code=503, content={"message": "Image Model not loaded. Prediction disabled."})
    
    try:
        image_data = await file.read()
        image = Image.open(BytesIO(image_data)).convert("L")  # Grayscale
        image_tensor = image_transform(image).unsqueeze(0).to(device)

        with torch.inference_mode():
            output = image_model(image_tensor)
            probs = F.softmax(output, dim=1)[0]
            pred_idx = torch.argmax(output, dim=1).item()
            pred_class = IMAGE_CLASSES[pred_idx]
            confidence = probs[pred_idx].item()
            recommendation = recommendations.get(pred_class, "No recommendation available.")

        return {
            "predicted_class": pred_class,
            "confidence": f"{confidence:.4f}",
            "model_version": "newCNN (Grayscale 128x128)",
            "recommendation": recommendation
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Image prediction failed: {e}"})

# --- TEXT PREDICTION ENDPOINT ---
@app.post("/text-prediction")
async def text_predict(data: TextInput):
    if not TEXT_LOADED:
        return JSONResponse(status_code=503, content={"message": "Text Model not loaded. Prediction disabled."})
    
    try:
        encoding = text_tokenizer.encode_plus(
            data.text_input,
            add_special_tokens=True,
            max_length=MAX_SEQ_LENGTH,
            padding="max_length",
            truncation=True,
            return_attention_mask=True,
            return_tensors="pt"
        )
        input_ids = encoding['input_ids'].to(device)
        attention_mask = encoding['attention_mask'].to(device)

        with torch.no_grad():
            output = text_model(input_ids, attention_mask=attention_mask)
        logits = output.logits
        probs = F.softmax(logits, dim=1)[0]
        pred_idx = torch.argmax(logits, dim=1).item()
        pred_class = TEXT_CLASSES[pred_idx]
        confidence = probs[pred_idx].item()
        recommendation = recommendations.get(pred_class, "No recommendation available.")

        return {
            "predicted_class": pred_class,
            "confidence": f"{confidence:.4f}",
            "model_version": "DistilBERT (38 Classes)",
            "recommendation": recommendation
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Text prediction failed: {e}"})

# --- SERVE STATIC FILES (Frontend) ---
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
async def serve_index():
    return FileResponse('static/index.html')

