# 🌿 PlantDocBot: AI Plant Disease Diagnosis

An **AI-powered web application** that allows users — especially farmers and gardeners — to upload images of plant leaves or describe symptoms via text, and receive an accurate **plant disease diagnosis** and **treatment recommendations** in real-time.

---

## ✨ Key Features

- **🌱 Dual-Modal Diagnosis**: Get predictions by either uploading a leaf image or describing the plant's symptoms in plain text.  
- **🧠 AI-Powered Predictions**: Utilizes a **custom-trained CNN** for image classification and a **fine-tuned DistilBERT** model for text-based symptom analysis.  
- **⚡ Instant Recommendations**: Provides immediate, actionable treatment advice for the diagnosed disease.  
- **💻 Interactive Web Interface**: A clean and simple user interface built with **React** and **Tailwind CSS** for a smooth user experience.

---

## 🏗️ Architecture

The application follows a **dual-modal architecture** where user input is routed to the appropriate machine learning model. The output from the model is then mapped to a diagnosis and a corresponding treatment recommendation, which is sent back to the user.

---

## 🧰 Tech Stack

- **Backend**: FastAPI, Uvicorn  
- **Machine Learning**: PyTorch, Hugging Face Transformers, Scikit-learn  
- **Frontend**: React.js, Tailwind CSS  
- **Language**: Python 3.8+

---

## 📂 Project Structure

```
├── Colab-Notebooks/
│   ├── AIPlantDoc_image classification.ipynb
│   └── AIPlantDoc_text classification.ipynb
│
├── Project/
│   ├── static/
│   │   └── index.html
│   ├── text_model_artifacts/
│   │   └── ... (DistilBERT model files)
│   ├── models/
│   │   └── model.py
│   ├── main.py
│   ├── plant_cnn.pth
│   └── requirements.txt
│
├── readme.md
└── architecture.png
```

---

## 🚀 Setup and Installation

Follow these steps to run the project locally:

### 1️⃣ Clone the Repository

Replace the placeholder URL with your actual GitHub repository URL.

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Navigate to the Project Directory

```bash
cd Project
```

### 3️⃣ Create and Activate a Virtual Environment

#### 🪟 Windows:
```bash
python -m venv venv
.venv\Scripts\activate
```

#### 🐧 macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4️⃣ Install Dependencies

Make sure you’ve created a `requirements.txt` file using:

```bash
pip freeze > requirements.txt
```

Then install the dependencies:

```bash
pip install -r requirements.txt
```

### 5️⃣ Run the Application

```bash
uvicorn main:app --reload
```

The server will start and be accessible at 👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🌐 Usage

Open your browser and go to [http://127.0.0.1:8000](http://127.0.0.1:8000) to interact with the API.

### 📸 Image Diagnosis

1. Select the **"Image Diagnosis"** tab.  
2. Drag and drop a plant leaf image or click to upload.  
3. Click **"Diagnose from Image"** to get the result.

### ✍️ Text Diagnosis

1. Select the **"Text Diagnosis"** tab.  
2. Type the symptoms observed in the text box.  
3. Click **"Diagnose from Text"** to see the diagnosis and recommendations.

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Pull requests and suggestions are welcome!  
If you'd like to contribute, please fork the repository and make changes as you'd like.  

---

## 🌟 Acknowledgements

- [Hugging Face Transformers](https://huggingface.co/transformers/)  
- [PyTorch](https://pytorch.org/)  
- [FastAPI](https://fastapi.tiangolo.com/)  
- [PlantVillage Dataset](https://plantvillage.psu.edu/)

---

Made with ❤️ for farmers and plant lovers 🌿
