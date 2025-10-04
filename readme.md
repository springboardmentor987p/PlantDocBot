<b>🪴PlantDoc Bot: Full-Stack Dual-Modal Diagnosis</b><br><br>
This repository contains the complete codebase for PlantDoc Bot, an AI application designed to provide reliable disease diagnosis using both image analysis and symptom descriptions.

The project features a full-stack, connected architecture, showcasing proficiency in machine learning deployment and modern web technologies.

<b>🌟 Technologies Used</b>
<img width="964" height="488" alt="image" src="https://github.com/user-attachments/assets/b48da3b2-c9a7-42ad-beeb-3b7e31485707" />

<b>🔬 Model Training & Data Sources</b><br>
We executed a complete machine learning pipeline, including model training, asset downloading, and deployment integration.
<img width="970" height="373" alt="image" src="https://github.com/user-attachments/assets/12253d36-21bf-4795-8467-fc37af84dc93" />

<b>🚀 Full-Stack Application Flow</b>
The application demonstrates a standard production workflow: Frontend (Client) -> Backend (API) -> Model Inference.

<b>API Endpoints</b>

1.POST /image-prediction: Takes a file (multipart/form-data) and returns the predicted disease class (15 classes).

2.POST /text-prediction: Takes a JSON string and returns the predicted disease class (38 classes).

<br>
<b>Workflow</b>

1.The user interacts with the React frontend (loaded via index.html).

2.The frontend sends a request to the FastAPI backend (running on port 8000).

3.FastAPI routes the request to the appropriate PyTorch CNN or Hugging Face DistilBERT model.

4.The trained model generates a prediction.

5.FastAPI returns the result as JSON, which is displayed in the React UI.

