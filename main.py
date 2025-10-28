from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import torch
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch.nn as nn
from torchvision import transforms
from PIL import Image
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.preprocessing import LabelEncoder
import pandas as pd

# ---------------------------
# FastAPI app
# ---------------------------
app = FastAPI(title="Plant Classification API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Text Classification Model
# ---------------------------
text_model_path = "saved_model"  # Path to your saved DistilBERT model
text_tokenizer = AutoTokenizer.from_pretrained(text_model_path)
text_model = AutoModelForSequenceClassification.from_pretrained(text_model_path)
text_model.eval()

# Load class names from CSV dataset
df = pd.read_csv("dataset.csv")
from sklearn.preprocessing import LabelEncoder
encoder = LabelEncoder()
encoder.fit(df['caption'].tolist())
text_class_names = encoder.classes_.tolist()

# ---------------------------
# Image Classification Model
# ---------------------------
class BetterCNN(nn.Module):
    def __init__(self, num_classes):
        super(BetterCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.pool  = nn.MaxPool2d(2, 2)
        self.conv3 = nn.Conv2d(32, 64, 3, padding=1)
        self.conv4 = nn.Conv2d(64, 128, 3, padding=1)
        self.fc1   = nn.Linear(128 * 32 * 32, 256)
        self.fc2   = nn.Linear(256, num_classes)
        self.relu  = nn.ReLU()
        self.drop  = nn.Dropout(0.4)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = self.relu(self.conv3(x))
        x = self.relu(self.conv4(x))
        x = x.view(x.size(0), -1)
        x = self.relu(self.fc1(x))
        x = self.drop(x)
        return self.fc2(x)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Image class names
image_class_names = [
    'Pepper bell Bacterial spot', 'Pepper bell healthy',
    'Potato Early blight', 'Potato Late blight', 'Potato healthy',
    'Tomato Bacterial spot', 'Tomato Early blight', 'Tomato Late blight',
    'Tomato Leaf Mold', 'Tomato Septoria leaf spot',
    'Tomato Spider mites Two spotted spider mite', 'TomatoTarget Spot',
    'TomatoTomato YellowLeafCurl Virus', 'Tomato Tomato mosaic virus',
    'Tomato healthy'
]

# Recommendations dictionary
recommendation = {
    "Pepper bell Bacterial spot": "Remove infected leaves, avoid overhead watering, and apply copper-based fungicides.",
    "Pepper bell healthy": "No disease detected. Maintain proper watering, spacing, and fertilization for healthy growth.",

    "Potato Early blight": "Use fungicides containing chlorothalonil or copper-based products. Remove and destroy infected plant debris.",
    "Potato Late blight": "Apply fungicides such as mancozeb. Destroy infected plants and avoid overhead irrigation.",
    "Potato healthy": "No disease detected. Rotate crops and ensure good soil health.",

    "Tomato Bacterial spot": "Remove infected leaves, use disease-free seeds, and apply copper-based fungicides.",
    "Tomato Early blight": "Use fungicides containing chlorothalonil or mancozeb. Prune lower leaves to improve airflow.",
    "Tomato Late blight": "Apply fungicides with mancozeb or chlorothalonil. Remove and destroy infected plants.",
    "Tomato Leaf Mold": "Improve ventilation in greenhouse, avoid leaf wetness, and apply fungicides if severe.",
    "Tomato Septoria leaf spot": "Remove affected leaves, mulch soil, and apply fungicides like chlorothalonil.",
    "Tomato Spider mites Two spotted spider mite": "Spray water to reduce mites, use insecticidal soap, or miticides if infestation is heavy.",
    "TomatoTarget Spot": "Remove infected leaves, rotate crops, and apply protective fungicides.",
    "TomatoTomato YellowLeafCurl Virus": "Control whiteflies (the main vector), remove infected plants, and use resistant varieties.",
    "Tomato Tomato mosaic virus": "Remove infected plants, disinfect tools, and use resistant tomato varieties.",
    "Tomato healthy": "No disease detected. Maintain good watering and fertilization practices."
}

# Load CNN model
image_model = BetterCNN(num_classes=len(image_class_names))
image_model.load_state_dict(torch.load("plant_cnn_128.pth", map_location=device))
image_model.to(device)
image_model.eval()

# Image preprocessing
image_transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5]*3, std=[0.5]*3)
])

# ---------------------------
# Request Schema for Text Input
# ---------------------------
class TextInput(BaseModel):
    text: str

# ---------------------------
# Text Classification Endpoint
# ---------------------------
@app.post("/predict_text")
async def predict_text(text: TextInput):
    inputs = text_tokenizer([text.text], return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = text_model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        predicted_idx = torch.argmax(probs, dim=1).item()
        confidence = float(probs[0][predicted_idx].item() * 100)

    predicted_class = text_class_names[predicted_idx]
    return JSONResponse(content={
        "predicted_class": predicted_class,
        "confidence_percent": round(confidence, 2),
        "recommendation": recommendation.get(predicted_class, "No recommendation available.")
    })

# ---------------------------
# Image Classification Endpoint
# ---------------------------
@app.post("/predict_image")
async def predict_image(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    tensor = image_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = image_model(tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)
        predicted_idx = torch.argmax(probs, dim=1).item()
        confidence = float(probs[0][predicted_idx].item() * 100)

    predicted_class = image_class_names[predicted_idx]
    return JSONResponse(content={
        "predicted_class": predicted_class,
        "confidence_percent": round(confidence, 2),
        "recommendation": recommendation.get(predicted_class, "No recommendation available.")
    })
