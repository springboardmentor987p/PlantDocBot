# 🌱 Plant Doc - Plant Disease Detection System

A smart, AI-powered web application that helps gardeners and farmers diagnose plant diseases through image and text-based analysis.

![Plant Doc Screenshot](D:\Infosys Springboard Internship\Disease_Detection\frontend\Screenshot 2025-10-09 213110.png)

---

## ✨ Features

- **Text-Based Prediction:** Describe your plant's symptoms and get an AI-powered diagnosis.
- **Image-Based Prediction:** Upload an image of a plant leaf to detect diseases instantly.
- **Detailed Results:** Get a predicted disease name, confidence score, and description.
- **Treatment Recommendations:** Receive immediate and long-term advice for treating the detected disease.
- **Modern UI:** A clean, responsive, and user-friendly interface built with React and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Python, FastAPI
- **Machine Learning:** PyTorch, Transformers, Scikit-learn

---

## 🚀 How to Run Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- Node.js & npm
- Python & pip

## 📥 Model Setup

The machine learning models for this project are too large for GitHub and must be downloaded separately.

1.  **Download the models** from this link:
    [**Download these files from Google Drive**](https://drive.google.com/file/d/1MXMz-hBrqbqKnczM486nkbkY2rbSzaiU/view?usp=sharing)
    for text model (https://drive.google.com/drive/folders/1aqKHcEMsyzvO4ym0kHpsig3AoS1XOZ9L?usp=sharing) & (https://drive.google.com/file/d/1jZA8RYyh3S6iIzAWpEm90Rsk7mtgxhzP/view?usp=sharing)

2.  **Unzip the file** to get the `Models` folder.

3.  **Place the `Models` folder** inside the `backend/` directory of this project.

✔️ Your final folder structure should look like this:
backend/
├── Models/ <-- The folder you just downloaded and placed
│ ├── cnn_model.pth
│ └── best_model_text/
└── main.py

### 1. Clone the Repository

````bash
git clone [https://github.com/alokrj01/AI_Plant_Doc_Bot](https://github.com/alokrj01/AI_Plant_Doc_Bot)
cd your-repo-name

### 2. Setup and run the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

## requirements.txt
annotated-types==0.7.0
anyio==4.11.0
asttokens==3.0.0
certifi==2025.8.3
charset-normalizer==3.4.3
click==8.3.0
colorama==0.4.6
comm==0.2.3
debugpy==1.8.17
decorator==5.2.1
executing==2.2.1
fastapi==0.118.0
filelock==3.19.1
fsspec==2025.9.0
h11==0.16.0
huggingface-hub==0.35.3
idna==3.10
ipykernel==6.30.1
ipython==9.6.0
ipython_pygments_lexers==1.1.1
jedi==0.19.2
Jinja2==3.1.6
joblib==1.5.2
jupyter_client==8.6.3
jupyter_core==5.8.1
MarkupSafe==3.0.3
matplotlib-inline==0.1.7
mpmath==1.3.0
nest-asyncio==1.6.0
networkx==3.5
numpy==2.3.3
packaging==25.0
parso==0.8.5
pillow==11.3.0
platformdirs==4.4.0
prompt_toolkit==3.0.52
psutil==7.1.0
pure_eval==0.2.3
pydantic==2.11.9
pydantic_core==2.33.2
Pygments==2.19.2
python-dateutil==2.9.0.post0
python-multipart==0.0.20
pywin32==311
PyYAML==6.0.3
pyzmq==27.1.0
regex==2025.9.18
requests==2.32.5
safetensors==0.6.2
scikit-learn==1.6.1
scipy==1.16.2
setuptools==80.9.0
six==1.17.0
sniffio==1.3.1
stack-data==0.6.3
starlette==0.48.0
sympy==1.14.0
threadpoolctl==3.6.0
tokenizers==0.22.1
torch==2.8.0
torchvision==0.23.0
tornado==6.5.2
tqdm==4.67.1
traitlets==5.14.3
transformers==4.56.2
typing-inspection==0.4.2
typing_extensions==4.15.0
urllib3==2.5.0
uvicorn==0.37.0
wcwidth==0.2.14

### 3. Setup and Run the frontend
```bash
cd frontend
npm install
npm run dev
````
