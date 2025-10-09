from fastapi import FastAPI, UploadFile, File, Form
from torchvision import transforms
from PIL import Image
import torch
import joblib
import os
from pathlib import Path
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from models.model import newCNN

# --------------------
# Setup device
# --------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can replace "*" with ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# CNN MODEL (image)
# --------------------
mean = [0.4592542350292206, 0.4754604697227478, 0.4115070700645447]
std = [0.1860169768333435, 0.16259966790676117, 0.20085515081882477]

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])

idx_to_class = {
    0: 'Pepper bell Bacterial spot',
    1: 'Pepper bell healthy',
    2: 'Potato Early blight',
    3: 'Potato Late blight',
    4: 'Potato healthy',
    5: 'Tomato Bacterial spot',
    6: 'Tomato Early blight',
    7: 'Tomato Late blight',
    8: 'Tomato Leaf Mold',
    9: 'Tomato Septoria leaf spot',
    10: 'Tomato Spider mites Two spotted spider mite',
    11: 'Tomato Target Spot',
    12: 'Tomato Yellow Leaf Curl Virus',
    13: 'Tomato mosaic virus',
    14: 'Tomato healthy'
}

recommendations = {
    "Pepper bell Bacterial spot": "Apply copper-based fungicide, avoid overhead watering.",
    "Pepper bell healthy": "No disease detected. Maintain good irrigation and sunlight.",
    "Potato Early blight": "Use fungicides like chlorothalonil. Rotate crops yearly.",
    "Potato Late blight": "Remove infected leaves, apply fungicides.",
    "Potato healthy": "No disease detected. Ensure soil drainage.",
    "Tomato Bacterial spot": "Use copper spray, avoid working with wet plants.",
    "Tomato Early blight": "Prune lower leaves, use fungicides.",
    "Tomato Late blight": "Remove affected plants, apply fungicide quickly.",
    "Tomato Leaf Mold": "Improve ventilation, apply fungicide.",
    "Tomato Septoria leaf spot": "Remove infected leaves, rotate crops.",
    "Tomato Spider mites Two spotted spider mite": "Use insecticidal soap or neem oil.",
    "Tomato Target Spot": "Improve spacing, apply fungicides.",
    "Tomato Yellow Leaf Curl Virus": "Control whiteflies, plant resistant varieties.",
    "Tomato mosaic virus": "Remove infected plants, disinfect tools.",
    "Tomato healthy": "No disease detected. Maintain regular care."
}

# Load CNN model
cnn_model = newCNN(num_classes=15)
cnn_model.load_state_dict(torch.load("artifacts/plant_disease.pth", map_location=device))
cnn_model.to(device)
cnn_model.eval()

@app.get("/")
async def root():
    return {"message": "PlantDocBot API is running"}

@app.post("/image-prediction")
async def image_predict(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    image_tensor = image_transform(image).unsqueeze(0).to(device)

    with torch.inference_mode():
        output_tensor = cnn_model(image_tensor)
        prediction_idx = torch.argmax(output_tensor, dim=1).item()
        prediction_class = idx_to_class[prediction_idx]

    return {
        "predicted_class": prediction_class,
        "recommendation": recommendations.get(prediction_class, "No recommendation available.")
    }

# --------------------
# HUGGING FACE MODEL (text)
# --------------------
# Force offline mode to prevent HuggingFace Hub calls
os.environ["TRANSFORMERS_OFFLINE"] = "1"

hf_model_path = str((Path(__file__).parent / "artifacts" / "checkpoints" / "final_model").resolve()).replace("\\", "/")

hf_model = AutoModelForSequenceClassification.from_pretrained(hf_model_path, local_files_only=True)
hf_tokenizer = AutoTokenizer.from_pretrained(hf_model_path, local_files_only=True)
hf_encoder = joblib.load(os.path.join(hf_model_path, "label_encoder.joblib"))

@app.post("/text-prediction")
async def text_predict(text: str = Form(...)):
    inputs = hf_tokenizer(text, truncation=True, padding=True, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.inference_mode():
        outputs = hf_model(**inputs)
        logits = outputs.logits
        pred_id = torch.argmax(logits, dim=-1).item()
        pred_label = hf_encoder.inverse_transform([pred_id])[0]

    return {
        "predicted_class": pred_label,
        "recommendation": recommendations.get(pred_label, "No recommendation available.")
    }