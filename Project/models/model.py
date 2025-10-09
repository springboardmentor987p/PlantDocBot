import torch
from torch import nn

class newCNN(nn.Module):
    # in_channels defaults to 1 (Grayscale) to match the required input for saved weights
    def __init__(self, num_classes, in_channels=1):
        super(newCNN, self).__init__()
        
        # Convolutional Layers (Simple Naming)
        self.conv1 = nn.Conv2d(in_channels, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        
        # Fully Connected Layers (Input size 32*32*32 = 32768 for 128x128 image input)
        self.fc1 = nn.Linear(32 * 32 * 32, 128)
        self.fc2 = nn.Linear(128, num_classes)
        
        # Activation and Dropout
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)

    def forward(self, x):
        # Block 1: Conv -> ReLU -> Pool (128 -> 64)
        x = self.pool(self.relu(self.conv1(x)))
        
        # Block 2: Conv -> ReLU -> Pool (64 -> 32)
        x = self.pool(self.relu(self.conv2(x)))
        
        # Flatten
        x = x.view(x.size(0), -1)
        
        # Classifier
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x
