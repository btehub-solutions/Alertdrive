---
language: py
tags:
- computer-vision
- image-classification
- driver-drowsiness-detection
- edge-ai
- tflite
- tensorflow
- keras
- mobilenetv2
license: mit
metrics:
- accuracy
- roc_auc
---

# 🚗 AlertDrive AI - Driver Drowsiness & Safety Telemetry Model

AlertDrive AI is a lightweight, production-grade driver drowsiness detection system designed for high-performance deployment on both cloud servers and resource-constrained edge devices (e.g., in-vehicle embedded systems, Raspberry Pi, and mobile devices).

This repository hosts both the fully optimized fine-tuned functional **Keras Model (.h5)** and the highly optimized **Float16 Quantized TFLite Model (.tflite)**.

## 📊 Model Architecture & Performance

- **Base Architecture**: MobileNetV2 (Unfrozen from Layer 100 onwards for deep task specialization)
- **Input Dimensions**: 224x224x3 RGB
- **Classification Target**: Binary (0 = `DROWSY`, 1 = `NATURAL` / Alert)

### 📈 Benchmarks

| Model Variant | Test Accuracy | ROC AUC | Model Size | Target Deployment Platform |
| :--- | :---: | :---: | :---: | :--- |
| **Keras Fine-Tuned (.h5)** | 93.18% | 0.9890 | 13.31 MB | High-end Edge Systems / Cloud Servers |
| **Quantized TFLite (Float16)** | **93.32%** | **0.9890** | **4.94 MB** | Microcontrollers / Low-resource Edge Devices |

*The Float16 quantized model achieves a **62.9% reduction** in model footprint while perfectly preserving evaluation accuracy.*

---

## 🛠️ Usage & Integration

### 1. Integrating the High-Accuracy Keras Model (.h5)

```python
from huggingface_hub import hf_hub_download
import tensorflow as tf

# Download and load model
model_path = hf_hub_download(
    repo_id="btehubsolutions/alertdrive-model",
    filename="alertdrive_finetuned_model.h5"
)
model = tf.keras.models.load_model(model_path)

# Perform inference
# input_image must be preprocessed to (224, 224, 3) and rescaled by 1/255.0
prediction = model.predict(input_image)
class_label = "NATURAL" if prediction[0][0] > 0.5 else "DROWSY"
```

### 2. Integrating the Ultra-Lightweight Quantized TFLite Model (.tflite)

```python
import numpy as np
import tensorflow as tf
from huggingface_hub import hf_hub_download

# Download TFLite model file
tflite_path = hf_hub_download(
    repo_id="btehubsolutions/alertdrive-model",
    filename="alertdrive_model_quantized.tflite"
)

# Initialize Interpreter
interpreter = tf.lite.Interpreter(model_path=tflite_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Input image array shape must be [1, 224, 224, 3] and float32 normalized
interpreter.set_tensor(input_details[0]['index'], input_image_array)
interpreter.invoke()
output_data = interpreter.get_tensor(output_details[0]['index'])

class_label = "NATURAL" if output_data[0][0] > 0.5 else "DROWSY"
```

---

## 🚗 Production-Grade Face Telemetry & Fallback Pipeline

To complement the classifiers, the production deployment codebase supports active facial telemetry extraction:
- **Eye Aspect Ratio (EAR)**: Computes eye closure to monitor blink patterns and detect microsleep.
- **Mouth Aspect Ratio (MAR)**: Monitors facial configurations to track yawning.
- **Head Pose Estimation (Pitch/Yaw/Roll)**: Identifies side-glancing or active distraction behaviors.
- **PERCLOS Safety Scoring**: Tracks eye closure percentage over a 60-frame rolling window to log warning levels (`SAFE`, `WARNING ALERT`, `CRITICAL ALERT`).

### Mathematical Fallback Engine
To ensure driver-safety features never experience fatal runtime crashes, the pipeline incorporates an automatic **Mathematical Fallback Pipeline** that gracefully estimates nominal metrics even if local environments experience library incompatibilities or missing system camera devices.

---

## 👥 Developers
Developed by the **BTEHub Team** for deployment within Nigerian Road Safety and transport environments.
