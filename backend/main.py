from fastapi import FastAPI, UploadFile, File
import torch
from torchvision import transforms
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from Models.model1 import ImageClassifierCNN
from PIL import Image
import joblib
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware 

#Initialize FastAPI app
app = FastAPI(title = "Image + Text Classification Model" )

#Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

#Image Classification
#load Model
device = "cuda" if torch.cuda.is_available() else"cpu"

#load trained model
model = ImageClassifierCNN(15) #num_classes=15
model.load_state_dict(torch.load(r"D:\Infosys Springboard Internship\Disease_Detection\backend\Models\cnn_model.pth", map_location=device)) #r=raw string
model.to(device)
model.eval()   # put into inference mode

#define transformers
mean = [0.45923691987991333, 0.4754456877708435, 0.4114924371242523]
std = [0.18601608276367188, 0.16261300444602966, 0.20084309577941895]

image_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])

#class mapping
idx_to_class = {0: 'Pepper__bell___Bacterial_spot',
                1: 'Pepper__bell___healthy',
                2: 'Potato___Early_blight',
                3: 'Potato___Late_blight',
                4: 'Potato___healthy',
                5: 'Tomato_Bacterial_spot',
                6: 'Tomato_Early_blight',
                7: 'Tomato_Late_blight',
                8: 'Tomato_Leaf_Mold',
                9: 'Tomato_Septoria_leaf_spot',
                10:'Tomato_Spider_mites_Two_spotted_spider_mite',
                11: 'Tomato__Target_Spot',
                12: 'Tomato__Tomato_YellowLeaf__Curl_Virus',
                13: 'Tomato__Tomato_mosaic_virus',
                14: 'Tomato_healthy'}

#API Route
@app.post("/image-prediction")
def image_predict(file: UploadFile = File(...)):
  image = Image.open(file.file).convert("RGB")

  img_tensor = image_transform(image).unsqueeze(0).to(device)

  with torch.inference_mode():
    output_tensor = model(img_tensor)
    # pred_probabilities = torch.softmax(output_tensor, dim=1) #prediction probabilities using softmax
    pred_idx = torch.argmax(output_tensor, dim=1).item() #Get the prediction class index
    pred_label = idx_to_class[pred_idx] #Get the prediction class label

    return {
      "predicted_class": pred_label,
      # "probabilities": pred_probabilities.squeeze().tolist()
    }


# Text Classification
#load text model
encoder_path = (r"D:\Infosys Springboard Internship\Disease_Detection\backend\Models\encoder.pkl") #r=raw string
encoder = joblib.load(encoder_path) #label mapping
text_model_path = (r"D:\Infosys Springboard Internship\Disease_Detection\backend\Models\best_model_text") #r=raw string
tokenizer = AutoTokenizer.from_pretrained(text_model_path)
text_model = AutoModelForSequenceClassification.from_pretrained(text_model_path)
text_model.eval()

class TextInput(BaseModel):
  text:str
  
#API Route
@app.post("/text-prediction")
def predict_text(data: TextInput):
  inputs = tokenizer(data.text, return_tensors="pt", truncation=True, padding=True) #tokenize the texts
  with torch.inference_mode():
    outputs = text_model(**inputs)
  logits = outputs.logits #get predicted class index
  pred_idx = torch.argmax(logits, dim=-1).tolist()

  pred_label = encoder.inverse_transform(pred_idx) #get predicted class label
  return {
    "text": data.text,
    "Predicted_label": str(pred_label[0])
    } 


