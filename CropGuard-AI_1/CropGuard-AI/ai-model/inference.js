/**
 * Disease prediction inference.
 *
 * DEMO MODE (default): returns a plausible dummy result so the full app
 * flow (upload -> analysis -> result) works end-to-end without a trained
 * model.
 *
 * TO PLUG IN A REAL MODEL LATER:
 * 1. Fine-tune MobileNetV2/ResNet on the PlantVillage dataset (or similar),
 *    or serve it from a small Python/FastAPI microservice and call it here
 *    with fetch().
 * 2. Replace the body of predict() below with real inference, keeping the
 *    same return shape so nothing else in the app needs to change.
 */

const DUMMY_RESULTS = [
  {
    disease: "Early Blight",
    severity: "medium",
    symptoms: "Brown concentric spots on older leaves, yellowing around lesions.",
    recommendation:
      "Remove affected leaves, apply copper-based fungicide, avoid overhead watering. Re-check in 5-7 days.",
  },
  {
    disease: "Leaf Rust",
    severity: "low",
    symptoms: "Small orange-brown pustules on leaf undersides.",
    recommendation:
      "Improve air circulation between plants and apply a sulfur-based fungicide if spread continues.",
  },
  {
    disease: "Healthy",
    severity: "none",
    symptoms: "No visible lesions, discoloration, or pest damage detected.",
    recommendation: "No action needed. Continue regular monitoring.",
  },
  {
    disease: "Bacterial Spot",
    severity: "high",
    symptoms: "Dark, water-soaked spots with yellow halos spreading rapidly.",
    recommendation:
      "Isolate affected plants, apply copper spray, and consult an agriculture expert for lab confirmation.",
  },
];

/**
 * @param {string} imagePath - accepted for future real-model use, unused in demo mode
 * @param {string} cropName - accepted for future real-model use, unused in demo mode
 * @returns {{disease: string, confidence: number, severity: string, symptoms: string, recommendation: string}}
 */
function predict(imagePath, cropName) {
  const result = DUMMY_RESULTS[Math.floor(Math.random() * DUMMY_RESULTS.length)];
  const confidence = Math.round((0.78 + Math.random() * 0.19) * 100) / 100;

  return {
    disease: result.disease,
    confidence,
    severity: result.severity,
    symptoms: result.symptoms,
    recommendation: result.recommendation,
  };
}

module.exports = { predict };
