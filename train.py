# train.py
import os
import random
from pathlib import Path
from tqdm import tqdm

import torch
import torch.nn as nn
from torch.utils.data import random_split, DataLoader
from torchvision import transforms, datasets
from torchvision.datasets import ImageFolder

# Import your model definition (same as in models/model.py)
from models.model import newCNN

# ------------------ Configuration ------------------
DATA_ROOT = "dataset/PlantVillage"   # relative path to your dataset
OUT_MODEL = "plant_cnn.pth"
IMG_SIZE = 128
BATCH_SIZE = 32
NUM_EPOCHS = 10
LR = 1e-3
VAL_SPLIT = 0.2
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SEED = 42
# ----------------------------------------------------

torch.manual_seed(SEED)
random.seed(SEED)

# ✅ Define the same preprocessing as main.py
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# ✅ Load dataset
dataset = ImageFolder(DATA_ROOT, transform=transform)
num_classes = len(dataset.classes)
print("Found classes:", dataset.classes)
print("Total images:", len(dataset))

# ✅ Split into train/val
val_size = int(len(dataset) * VAL_SPLIT)
train_size = len(dataset) - val_size
train_ds, val_ds = random_split(dataset, [train_size, val_size])
print(f"Train size: {train_size}, Val size: {val_size}")

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

# ✅ Initialize model
model = newCNN(num_classes=num_classes, in_channels=1)
model = model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)

# ✅ Training and validation loops
def train_one_epoch(epoch):
    model.train()
    running_loss, correct, total = 0, 0, 0
    loop = tqdm(train_loader, desc=f"Train Epoch {epoch}")
    for imgs, labels in loop:
        imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * imgs.size(0)
        _, preds = outputs.max(1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)
        loop.set_postfix(loss=running_loss/total, acc=100.0*correct/total)
    return running_loss/total, 100.0*correct/total

def validate(epoch):
    model.eval()
    running_loss, correct, total = 0, 0, 0
    with torch.no_grad():
        loop = tqdm(val_loader, desc=f"Val   Epoch {epoch}")
        for imgs, labels in loop:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            running_loss += loss.item() * imgs.size(0)
            _, preds = outputs.max(1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
            loop.set_postfix(loss=running_loss/total, acc=100.0*correct/total)
    return running_loss/total, 100.0*correct/total

# ✅ Training
best_val_acc = 0.0
for epoch in range(1, NUM_EPOCHS + 1):
    train_loss, train_acc = train_one_epoch(epoch)
    val_loss, val_acc = validate(epoch)
    print(f"Epoch {epoch}: Train Acc {train_acc:.2f}%, Val Acc {val_acc:.2f}%")
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), OUT_MODEL)
        print(f"Saved best model ({val_acc:.2f}%) to {OUT_MODEL}")

# ✅ Save final model and print class list
torch.save(model.state_dict(), "plant_cnn_final.pth")
print("Training complete. Final class list:")
print(dataset.classes)
