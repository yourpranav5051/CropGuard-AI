"""
Disease prediction inference.

DEMO MODE (default): returns a plausible dummy result so the full app flow
(upload -> analysis -> result) works end-to-end without a trained model.

TO PLUG IN A REAL MODEL LATER:
1. Fine-tune MobileNetV2/ResNet on the PlantVillage dataset (or similar).
2. Save it as model.h5 (Keras) or model.pt (PyTorch) in this folder.
3. Replace the body of `predict()` below with real preprocessing + inference,
   keeping the same return shape so nothing else in the app needs to change.
"""
import random

DUMMY_RESULTS = [
    {
        "disease": "Early Blight",
        "severity": "medium",
        "symptoms": "Brown concentric spots on older leaves, yellowing around lesions.",
        "recommendation": "Remove affected leaves, apply copper-based fungicide, "
                           "avoid overhead watering. Re-check in 5-7 days.",
    },
    {
        "disease": "Leaf Rust",
        "severity": "low",
        "symptoms": "Small orange-brown pustules on leaf undersides.",
        "recommendation": "Improve air circulation between plants and apply a "
                           "sulfur-based fungicide if spread continues.",
    },
    {
        "disease": "Healthy",
        "severity": "none",
        "symptoms": "No visible lesions, discoloration, or pest damage detected.",
        "recommendation": "No action needed. Continue regular monitoring.",
    },
    {
        "disease": "Bacterial Spot",
        "severity": "high",
        "symptoms": "Dark, water-soaked spots with yellow halos spreading rapidly.",
        "recommendation": "Isolate affected plants, apply copper spray, and "
                           "consult an agriculture expert for lab confirmation.",
    },
]


def predict(image_path: str, crop_name: str) -> dict:
    """
    Returns a dict: {disease, confidence, severity, symptoms, recommendation}.
    `image_path` and `crop_name` are accepted now so the real model can use
    them later; the demo version ignores them and picks a random result.
    """
    result = random.choice(DUMMY_RESULTS)
    confidence = round(random.uniform(0.78, 0.97), 2)

    return {
        "disease": result["disease"],
        "confidence": confidence,
        "severity": result["severity"],
        "symptoms": result["symptoms"],
        "recommendation": result["recommendation"],
    }
