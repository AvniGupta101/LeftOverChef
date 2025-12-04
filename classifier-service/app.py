# # classifier-service/app.py
# import io
# import os
# import traceback
# import base64
# from typing import Optional
# from fastapi import FastAPI, HTTPException, Request
# from pydantic import BaseModel
# from PIL import Image
# import torch

# from torchvision import transforms

# # your model builder import (unchanged)
# from model_def import build_model

# # config
# MODEL_STATE_PATH = os.environ.get("MODEL_STATE_PATH", "model_state_dict.pth")
# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# IMG_SIZE = int(os.environ.get("IMG_SIZE", 224))

# app = FastAPI(title="LeftoverChef Classifier (friendly JSON)")

# # Preprocessing (MobileNetV2 / ImageNet-style)
# transform = transforms.Compose([
#     transforms.Resize((IMG_SIZE, IMG_SIZE)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
# ])

# # mapping: index 0 -> fresh, index 1 -> spoiled
# LABELS = ["fresh", "spoiled"]

# # Request/response pydantic models
# class ClassifyRequest(BaseModel):
#     # accept either key name the client may send
#     imageBase64: Optional[str] = None
#     image_base64: Optional[str] = None

# class ClassifyResponse(BaseModel):
#     prediction: str
#     confidence: float

# # global model container
# MODEL = None

# def load_model():
#     global MODEL
#     if not os.path.exists(MODEL_STATE_PATH):
#         raise RuntimeError(f"Model file not found at {MODEL_STATE_PATH}")
#     model = build_model(num_classes=2, pretrained=False)
#     state = torch.load(MODEL_STATE_PATH, map_location=DEVICE)
#     # handle cases where saved file is state_dict or full model
#     if isinstance(state, dict) and "state_dict" in state:
#         state = state["state_dict"]
#     # strip 'module.' if present
#     new_state = {}
#     for k, v in state.items():
#         if k.startswith("module."):
#             new_state[k[len("module."):]] = v
#         else:
#             new_state[k] = v
#     model.load_state_dict(new_state)
#     model.to(DEVICE)
#     model.eval()
#     MODEL = model
#     print("Model loaded on", DEVICE)

# def decode_base64_image(data_uri: str) -> Image.Image:
#     if not data_uri or not isinstance(data_uri, str):
#         raise ValueError("No image data provided")
#     # Accept both "data:image/..;base64,..." and raw base64
#     if data_uri.startswith("data:"):
#         try:
#             _, data = data_uri.split(",", 1)
#         except Exception:
#             raise ValueError("Invalid data URI")
#     else:
#         data = data_uri
#     try:
#         img_bytes = base64.b64decode(data)
#         img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
#         return img
#     except Exception as e:
#         raise ValueError("Invalid base64 image") from e

# # def predict(img: Image.Image):
# #     if MODEL is None:
# #         raise RuntimeError("Model not loaded")
# #     x = transform(img).unsqueeze(0).to(DEVICE)
# #     with torch.no_grad():
# #         out = MODEL(x)
# #         if isinstance(out, (tuple, list)):
# #             out = out[0]
# #         probs = torch.softmax(out, dim=1).cpu().numpy()[0]  # shape (num_classes,)
# #     # pick best
# #     idx = int(np.argmax(probs))
# #     prediction_label = LABELS[idx]  # "fresh" or "spoiled"
# #     confidence = float(probs[idx])
# #     # Also return raw probs if you want (not used here)
# #     return prediction_label, confidence, probs.tolist()

# def predict(img: Image.Image):
#     if MODEL is None:
#         raise RuntimeError("Model not loaded")

#     # 1. Preprocess
#     x = transform(img).unsqueeze(0).to(DEVICE)  # shape: [1, C, H, W]

#     # 2. Forward pass
#     with torch.no_grad():
#         out = MODEL(x)
#         if isinstance(out, (tuple, list)):
#             out = out[0]

#         # out shape: [1, num_classes]
#         probs = torch.softmax(out, dim=1)  # tensor [1, num_classes]

#     # 3. Take the first (and only) row
#     probs_row = probs[0]                 # tensor [num_classes]

#     # 4. Get max probability and index using torch only
#     confidence_tensor, idx_tensor = torch.max(probs_row, dim=0)
#     idx = int(idx_tensor.item())
#     confidence = float(confidence_tensor.item())

#     prediction_label = LABELS[idx]       # "fresh" or "spoiled"
#     probs_list = probs_row.tolist()      # just for debugging / optional

#     return prediction_label, confidence, probs_list

# @app.on_event("startup")
# def startup_event():
#     load_model()

# @app.post("/classify", response_model=ClassifyResponse)
# async def classify(req: ClassifyRequest, request_raw: Request):
#     # Accept either key name to be flexible
#     image_payload = req.imageBase64 or req.image_base64
#     if not image_payload:
#         raise HTTPException(status_code=400, detail="Missing imageBase64 or image_base64 in request body")

#     try:
#         img = decode_base64_image(image_payload)
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))

#     try:
#         pred_label, confidence, probs = predict(img)
#         # Log a concise line to the terminal for debugging
#         client_ip = request_raw.client.host if request_raw.client else "unknown"
#         print(f"[classify] client={client_ip} => prediction={pred_label} confidence={confidence:.4f} probs={probs}")
#         return {"prediction": pred_label, "confidence": confidence}
   

#     except Exception as e:
#         print("FULL ERROR BELOW")
#         traceback.print_exc()
#         print("---------------")
#         raise HTTPException(status_code=500, detail=str(e))

# classifier-service/app.py
import io
import os
import traceback
import base64
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from PIL import Image
import torch
from torchvision import transforms

# your model builder import (unchanged)
from model_def import build_model

# config
MODEL_STATE_PATH = os.environ.get("MODEL_STATE_PATH", "model_state_dict.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMG_SIZE = int(os.environ.get("IMG_SIZE", 224))

app = FastAPI(title="LeftoverChef Classifier (friendly JSON)")

# Preprocessing: ONLY resize here (PIL-level transform, no numpy)
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
])

# mapping: index 0 -> fresh, index 1 -> spoiled
LABELS = ["fresh", "spoiled"]

# Request/response pydantic models
class ClassifyRequest(BaseModel):
    # accept either key name the client may send
    imageBase64: Optional[str] = None
    image_base64: Optional[str] = None


class ClassifyResponse(BaseModel):
    prediction: str
    confidence: float


# global model container
MODEL = None


def load_model():
    global MODEL
    if not os.path.exists(MODEL_STATE_PATH):
        raise RuntimeError(f"Model file not found at {MODEL_STATE_PATH}")

    model = build_model(num_classes=2, pretrained=False)
    state = torch.load(MODEL_STATE_PATH, map_location=DEVICE)

    # handle cases where saved file is state_dict or full model
    if isinstance(state, dict) and "state_dict" in state:
        state = state["state_dict"]

    # strip 'module.' if present
    new_state = {}
    for k, v in state.items():
        if k.startswith("module."):
            new_state[k[len("module."):]] = v
        else:
            new_state[k] = v

    model.load_state_dict(new_state)
    model.to(DEVICE)
    model.eval()
    MODEL = model
    print("Model loaded on", DEVICE)


def decode_base64_image(data_uri: str) -> Image.Image:
    if not data_uri or not isinstance(data_uri, str):
        raise ValueError("No image data provided")

    # Accept both "data:image/..;base64,..." and raw base64
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


def pil_to_tensor_no_numpy(img: Image.Image) -> torch.Tensor:
    """
    Convert a PIL RGB image to a float tensor [C, H, W] in [0,1] range
    using only PyTorch (no NumPy).
    """
    if img.mode != "RGB":
        img = img.convert("RGB")

    w, h = img.size  # (width, height)
    img_bytes = img.tobytes()  # len = w * h * 3

    # Create uint8 tensor from bytes
    data = torch.ByteTensor(torch.ByteStorage.from_buffer(img_bytes))
    # Shape to [H, W, C]
    data = data.view(h, w, 3)
    # Permute to [C, H, W] and convert to float in [0,1]
    tensor = data.permute(2, 0, 1).float().div_(255.0)

    return tensor


def predict(img: Image.Image):
    """
    Run model prediction on a PIL image.
    Returns (prediction_label, confidence, probs_list)
    """
    if MODEL is None:
        raise RuntimeError("Model not loaded")

    # 1. Resize (PIL-level)
    img_resized = transform(img)  # still a PIL.Image

    # 2. Convert to tensor [C, H, W] in [0,1] without NumPy
    x = pil_to_tensor_no_numpy(img_resized)

    # 3. Normalize like ImageNet
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    x = (x - mean) / std

    # 4. Add batch dimension and move to device: [1, C, H, W]
    x = x.unsqueeze(0).to(DEVICE)

    # 5. Forward pass
    with torch.no_grad():
        out = MODEL(x)
        if isinstance(out, (tuple, list)):
            out = out[0]
        probs = torch.softmax(out, dim=1)  # [1, num_classes]

    # 5.5. Extract per-sample tensors
    logits_row = out[0]       # [num_classes]
    probs_row = probs[0]      # [num_classes]

    # 6. Argmax using torch only
    confidence_tensor, idx_tensor = torch.max(probs_row, dim=0)
    idx = int(idx_tensor.item())
    confidence = float(confidence_tensor.item())

    prediction_label = LABELS[idx]
    probs_list = probs_row.tolist()
    logits_list = logits_row.tolist()

    # 7. Debug logging for analysis
    print(
        "[classify-debug]",
        "logits=", logits_list,
        "probs=", probs_list,
        "pred=", prediction_label,
        "conf=", f"{confidence:.4f}",
        flush=True,
    )

    return prediction_label, confidence, probs_list


@app.on_event("startup")
def startup_event():
    load_model()


@app.post("/classify", response_model=ClassifyResponse)
async def classify(req: ClassifyRequest, request_raw: Request):
    # Accept either key name to be flexible
    image_payload = req.imageBase64 or req.image_base64
    if not image_payload:
        raise HTTPException(
            status_code=400,
            detail="Missing imageBase64 or image_base64 in request body",
        )

    try:
        img = decode_base64_image(image_payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        pred_label, confidence, probs = predict(img)
        # Log a concise line to the terminal for debugging
        client_ip = request_raw.client.host if request_raw.client else "unknown"
        print(
            f"[classify] client={client_ip} => "
            f"prediction={pred_label} confidence={confidence:.4f} probs={probs}"
        )
        return {"prediction": pred_label, "confidence": confidence}

    except Exception as e:
        print("FULL ERROR BELOW")
        traceback.print_exc()
        print("---------------")
        raise HTTPException(status_code=500, detail=str(e))
