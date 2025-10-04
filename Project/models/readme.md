<h2>Models Subdirectory</h2><br><br>
This directory contains the custom PyTorch model architecture and serves as a placeholder for structural components of the machine learning backend.

<h4>📁 Contents</h4>

<img width="974" height="164" alt="image" src="https://github.com/user-attachments/assets/e781053a-d80c-47c6-80d7-02c83c14ad88" />


<h4>⚙️ Image Model Details (newCNN)</h4>

The newCNN model uses a shallow convolutional structure optimized for grayscale (1-channel) input at a resolution of 128x128 pixels.

-Type: Convolutional Neural Network (CNN)

-Input: Grayscale (1-channel, 128x128)

-Output Classes: 15 Plant Disease Classes

-Load Mechanism: Weights are loaded from plant_cnn.pth.

Note: The model structure in this file (model.py) is designed to strictly align with the naming conventions (conv1, fc1) of the pre-trained weights to avoid PyTorch loading errors.
