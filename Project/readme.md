PlantDoc Bot: Dual-Modal Disease Prediction API


🌿 Overview

PlantDoc Bot is a comprehensive application for diagnosing common plant diseases using two independent machine learning models: Image Classification and Text Classification.

The project is built on a high-performance FastAPI backend that exposes prediction endpoints and a single-file React frontend for a clean, user-friendly interface.



✨ Features

Image Diagnosis: Uses a fine-tuned PyTorch CNN (Convolutional Neural Network) to classify diseases from uploaded leaf images (15 classes).

Text Diagnosis: Uses a pre-trained Hugging Face DistilBERT model to classify diseases from user-entered symptom descriptions.

API Service: High-speed prediction endpoints built with FastAPI and Uvicorn.

Frontend: Simple, responsive user interface built using React and Tailwind CSS for easy local deployment.


🚀 Setup and Launch
Prerequisites~

>Python 3.8+

>Git

>Model Artifacts: Ensure your trained weights (plant_cnn.pth) and the complete text model directory (text_model_artifacts/) are present in the project root.

1. Environment Setup
#Clone the repository
git clone [https://github.com/springboardmentor987p/PlantDocBot/tree/intern-HarshKumarDubey/Project]
cd plantdocbot

#Create a Virtual Environment
python -m venv myenv

#Git Bash: source myenv/Scripts/activate
#PowerShell: .\myenv\Scripts\Activate.ps1

#Install required dependencies
pip install -r requirements.txt 
#NOTE: You may need to manually run: pip install torch uvicorn python-multipart fastapi torchvision transformers accelerate 

2. Run the Backend API
Start the FastAPI server. The CORSMiddleware is already configured in main.py to allow the frontend connection.

uvicorn main:app --reload

3. Run the Frontend
Some browsers block or restrict loading local .jsx files with <script type="text/babel"> when using the protocol.
Solution: Use a simple local server. In your project folder, inside a new terminal run:

python -m http.server 8000

this will run the application on : http://localhost:8000/index.html
