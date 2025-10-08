# 🌿 PlantDocBot

An intelligent plant disease prediction system that combines **Image Classification** and **Text Classification** to detect and identify plant diseases.  
This project uses **Deep Learning** models integrated with a FastAPI backend and a simple frontend interface.

---

## 📘 Project Overview

PlantDocBot allows users to:
- Upload an image of a diseased plant leaf 🌱
- Input text describing visible symptoms ✍️
- Receive a combined prediction of the disease type  
- Get preventive measures and recommendations automatically

---

## 🧩 Project Structure

PlantDocBot/
│
├── backend/ # FastAPI backend (model inference + API routes)
│ ├── main.py
│ ├── requirements.txt
│ ├── models/ # Place your trained model files here (.pth)
│ ├── utils/
│ └── ...
│
├── frontend/ # Frontend (React or HTML/CSS/JS interface)
│ ├── index.html
│ ├── app.js
│ └── ...
│
├── Image_Classification_Model.ipynb # Model training notebook (Image)
├── Text_Classification_Model.ipynb # Model training notebook (Text)
│
└── README.md # This file

⚙️ Technologies Used

### 🔸 Machine Learning / Deep Learning
- **PyTorch / TorchVision**
- **TensorFlow / Keras**
- **scikit-learn**
- **OpenCV**
- **Pandas, NumPy**

### 🔸 NLP
- **NLTK**
- **spaCy**
- **TextBlob**

### 🔸 Backend
- **FastAPI**
- **Uvicorn**
- **Python 3.10+**

### 🔸 Frontend
- **React / HTML / CSS / JavaScript**

---

## 📦 Setup Instructions

**1.Create and Activate Virtual Environment**
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   #macOS/Linux

**2.Install Dependencies**

**3.Add Trained Models**
⚠️ Important:
Copy your trained .pth model file and zip file(extracted) into the same folder where your backend code resides
(e.g., backend/models/ or directly inside backend/ depending on your structure).

**4. Run the Backend**
uvicorn main:app --reload

**5.Run the Frontend**

If using React:
npm install
npm start

### Model Training

The two notebooks in this repository:

Image_Classification_Model.ipynb
Text_Classification_Model.ipynb

contain the end-to-end training pipelines for both models.
Each outputs a .pth file and zip file that must be placed in the backend folder for serving predictions.

### 💡 Future Enhancements

Add support for more plant species 🌾
Integrate live camera capture 📷
Deploy backend on AWS / Render / Azure ☁️

### Contributor
Sai Bhanu Sri Maghoni Gadepally
