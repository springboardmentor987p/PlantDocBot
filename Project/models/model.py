import torch.nn as nn 
class newCNN_gray(nn.Module):   # model
  def __init__(self, num_classes=15):
    super().__init__()

    self.block1 = nn.Sequential(
        nn.Conv2d(in_channels=1,out_channels=32, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.Conv2d(in_channels=32,out_channels=32, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.MaxPool2d(2, 2)
    )

    self.block2 = nn.Sequential(
        nn.Conv2d(in_channels=32,out_channels=64, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.Conv2d(in_channels=64,out_channels=64, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.MaxPool2d(kernel_size=2, stride=2)
    )

    self.block3 = nn.Sequential(
        nn.Conv2d(in_channels=64,out_channels=128, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.Conv2d(in_channels=128,out_channels=128, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.MaxPool2d(kernel_size=2, stride=2)
    )

    # REMOVE AdaptiveAvgPool2d

    self.classifier = nn.Sequential(
        nn.Flatten(),
        nn.Linear(in_features=128*28*28, out_features=512),  # Restore to match weights
        nn.ReLU(),
        nn.Dropout(0.5),
        nn.Linear(in_features=512, out_features=num_classes),
    )

  def forward(self, x):
    x = self.block1(x)
    x = self.block2(x)
    x = self.block3(x)
    # REMOVE self.pool(x)
    x = self.classifier(x)
    return x