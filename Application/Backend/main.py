from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn.functional as F  # Import the functional module
from torchvision import transforms
from PIL import Image
import io
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from models.model import PlantVillageCNN_RGB

app = FastAPI(
    title="Plant Disease and Text Classification API",
    description="An API to perform both image (plant disease) and text classification with recommendations and confidence scores.",
    version="1.2.0"
)

origins = ["http://localhost:3000", "localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"


image_model = PlantVillageCNN_RGB(output_shape=15)
image_model.load_state_dict(torch.load("plantvillage_rgb.pth", map_location=device))
image_model.to(device)
image_model.eval()

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.4594, 0.4749, 0.4108], std=[0.1855, 0.1621, 0.1997])
])

image_idx_to_class = {
    0: 'Pepper bell Bacterial spot', 1: 'Pepper bell healthy', 2: 'Potato Early blight',
    3: 'Potato Late blight', 4: 'Potato healthy', 5: 'Tomato Bacterial spot',
    6: 'Tomato Early blight', 7: 'Tomato Late blight', 8: 'Tomato Leaf Mold',
    9: 'Tomato Septoria leaf spot', 10: 'Tomato Spider mites Two spotted spider mite',
    11: 'Tomato Target Spot', 12: 'Tomato Tomato YellowLeaf Curl Virus',
    13: 'Tomato Tomato mosaic virus', 14: 'Tomato healthy'
}


class TextItem(BaseModel):
    text: str

text_model_dir = "text_model/final_model"
text_tokenizer = AutoTokenizer.from_pretrained(text_model_dir)
text_model = AutoModelForSequenceClassification.from_pretrained(text_model_dir)
text_model.to(device)
text_model.eval()

text_id_to_label = image_idx_to_class

recommendations = {
    'Pepper bell Bacterial spot': "Remove and destroy affected plant parts. Avoid overhead watering. Apply copper-based bactericides as a preventive measure.",
    'Pepper bell healthy': "Your plant appears to be healthy. Maintain good watering and fertilization practices.",
    'Potato Early blight': "Apply fungicides containing mancozeb or chlorothalonil. Practice crop rotation and ensure good air circulation.",
    'Potato Late blight': "This is a serious disease. Apply fungicides immediately. Destroy infected plants to prevent spread. Ensure proper spacing for air flow.",
    'Potato healthy': "Your plant appears to be healthy. Continue to monitor for signs of blight, especially in cool, wet weather.",
    'Tomato Bacterial spot': "Avoid working with plants when they are wet. Apply copper-based sprays. Remove infected lower leaves.",
    'Tomato Early blight': "Prune off lower leaves. Mulch around the base of the plant. Apply a fungicide rated for early blight.",
    'Tomato Late blight': "Act quickly. Remove all affected foliage and fruit. Apply a targeted fungicide. Improve air circulation.",
    'Tomato Leaf Mold': "Reduce humidity and improve air circulation. Stake plants to lift them off the ground. Use a fungicide if the problem persists.",
    'Tomato Septoria leaf spot': "Remove infected leaves. Use a fungicide containing chlorothalonil or mancozeb. Water at the base of the plant.",
    'Tomato Spider mites Two spotted spider mite': "Spray plants with a strong stream of water to dislodge mites. Use insecticidal soap or horticultural oil. Introduce predatory mites as a biological control.",
    'Tomato Target Spot': "Improve air circulation. Apply a preventative fungicide. Rotate crops and remove plant debris at the end of the season.",
    'Tomato Tomato YellowLeaf Curl Virus': "There is no cure. Remove and destroy the infected plant to prevent spread by whiteflies. Control whitefly populations with insecticides or physical barriers.",
    'Tomato Tomato mosaic virus': "There is no cure. Remove and destroy the infected plant. Disinfect tools and hands after handling.",
    'Tomato healthy': "Your plant looks healthy. Ensure consistent watering and proper nutrition to maintain its health."
}


@app.get("/", summary="Root endpoint")
def read_root():
    return {"message": "Welcome to the Multi-Modal API. Go to /docs to see the endpoints."}

@app.post("/image-prediction/", summary="Predict disease from an image file")
def predict_image(file: UploadFile = File(...)):
    contents = file.file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_tensor = image_transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = image_model(image_tensor)
        
        probabilities = F.softmax(output, dim=1)
        confidence_score, prediction_idx_tensor = torch.max(probabilities, 1)
        
        prediction_idx = prediction_idx_tensor.item()
        confidence = confidence_score.item()
        
        predicted_class = image_idx_to_class.get(prediction_idx, "Unknown Class")
        recommendation = recommendations.get(predicted_class, "No recommendation available.")

    return {
        "filename": file.filename, 
        "predicted_class": predicted_class,
        "confidence": confidence,  
        "recommendation": recommendation
    }

@app.post("/text-prediction/", summary="Predict the class of a given text")
def predict_text(item: TextItem):
    inputs = text_tokenizer(item.text, return_tensors="pt", truncation=True, padding=True).to(device)

    with torch.no_grad():
        logits = text_model(**inputs).logits
        
        probabilities = F.softmax(logits, dim=1)
        confidence_score, predicted_class_id_tensor = torch.max(probabilities, 1)

        predicted_class_id = predicted_class_id_tensor.item()
        confidence = confidence_score.item()
        
        predicted_class_name = text_id_to_label.get(predicted_class_id, "Unknown Class")
        recommendation = recommendations.get(predicted_class_name, "No recommendation available.")

    return {
        "input_text": item.text, 
        "predicted_class": predicted_class_name,
        "confidence": confidence,  
        "recommendation": recommendation
    }
