PlantDoc Bot

Tagline: Diagnose plant health from an image or a text description.

About the Project

PlantDoc Bot is a lightweight plant-disease assistant. It supports two independent diagnosis modes—image-based and text-based—so users can either upload a leaf photo or type symptoms to get likely diseases with confidence scores. The interface is simple (drag-and-drop or text tab) and the backend serves compact prediction endpoints.

What It Can Do

-> Identify plant diseases from leaf images.

-> Suggest likely diseases from symptom text.

-> Return top prediction with a simple confidence indicator.

-> Provide a clean, minimal web UI for quick triage.

Features

-> Lightweight front end: HTML/CSS with a small JSX component.

-> Modular backend: separate model helpers for image and text.

-> Notebook support: training/experiments stored in Colab notebooks.

Git-friendly: large model files are kept out of version control.

Project Structure
PlantDocBot/
├─ CollabNotebook/
│  ├─ Dataset.ipynb
│  └─ ImageAndTextClassificationModels.ipynb
├─ Project/
│  ├─ index.html            # UI
│  ├─ style.css             # Styles
│  ├─ PlantDocApp.jsx       # Front-end logic
│  ├─ main.py               # Backend app / endpoints
│  ├─ models/
│  │  └─ model.py           # Model loading & inference
│  └─ text_model_artifacts/ # Text model artifacts (weights ignored)
├─ .gitignore
└─ README.md
