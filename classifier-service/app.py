# classifier-service/app.py
import io
import os
import base64
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
import torch
import numpy as np
from torchvision import transforms
from model_def import build_model

# config
MODEL_STATE_PATH = os.environ.get("MODEL_STATE_PATH", "model_state_dict.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMG_SIZE = 224

app = FastAPI(title="LeftoverChef Classifier")

# import model class you created
from model_def import Model as ModelClass

# Preprocessing (MobileNetV2 / ImageNet-style)
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]),
])

# Request/response pydantic models
class ClassifyRequest(BaseModel):
    imageBase64: str  # data URI or raw base64

class PredItem(BaseModel):
    className: str
    probability: float

class ClassifyResponse(BaseModel):
    predictions: List[PredItem]

# global model container
MODEL = None



def load_model():
    global MODEL
    if not os.path.exists(MODEL_STATE_PATH):
        raise RuntimeError(f"Model file not found at {MODEL_STATE_PATH}")
    # build the same MobileNetV2 architecture
    model = build_model(num_classes=2, pretrained=False)
    state = torch.load(MODEL_STATE_PATH, map_location=DEVICE)
    model.load_state_dict(state)   # keys should match now
    model.to(DEVICE)
    model.eval()
    MODEL = model
    print("Model loaded on", DEVICE)

def decode_base64_image(data_uri: str) -> Image.Image:
    # Accept either "data:image/..;base64,..." or raw base64
    if data_uri.startswith("data:"):
        try:
            _, data = data_uri.split(",", 1)
        except Exception:
            raise ValueError("Invalid data URI")
    else:
        data = data_uri
    try:
        img_bytes = base64.b64decode(data)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        return img
    except Exception as e:
        raise ValueError("Invalid base64 image") from e

def predict(img: Image.Image, topk: int = 5):
    if MODEL is None:
        raise RuntimeError("Model not loaded")
    x = transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        out = MODEL(x)
        # some models return tuple
        if isinstance(out, (tuple, list)):
            out = out[0]
        probs = torch.softmax(out, dim=1).cpu().numpy()[0]  # shape (num_classes,)
    # top-k
    idxs = np.argsort(probs)[::-1][:topk]
    results = []
    for i in idxs:
        results.append({"className": str(int(i)), "probability": float(probs[i])})
    return results

@app.on_event("startup")
def startup_event():
    load_model()

@app.post("/classify", response_model=ClassifyResponse)
async def classify(req: ClassifyRequest):
    try:
        img = decode_base64_image(req.imageBase64)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    try:
        preds = predict(img, topk=5)
        return {"predictions": preds}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
