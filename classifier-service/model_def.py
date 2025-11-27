# classifier-service/model_def.py
import torch
import torchvision.models as models
import torch.nn as nn

def build_model(num_classes=2, pretrained=False):
    """
    Build MobileNetV2 with a final linear layer of size `num_classes`.
    Matches the architecture used in your notebook.
    """
    # Use torchvision's mobilenet_v2
    model = models.mobilenet_v2(weights=None if not pretrained else models.MobileNet_V2_Weights.IMAGENET1K_V1)
    # Replace classifier final layer
    num_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_features, num_classes)
    return model

# Optional convenience: a class wrapper (same as returned model)
class Model(nn.Module):
    def __init__(self, num_classes=2, pretrained=False):
        super().__init__()
        self.net = build_model(num_classes=num_classes, pretrained=pretrained)

    def forward(self, x):
        return self.net(x)
