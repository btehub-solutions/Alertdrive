import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import hf_hub_download
import PIL.Image
import io

app = FastAPI(title="AlertDrive AI API")

# Enable CORS for Flutter/React Native app integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Download TFLite model from Hugging Face on startup
REPO_ID = "btehubsolutions/alertdrive-model"
MODEL_FILENAME = "alertdrive_model_quantized.tflite"

print("🔄 Downloading TFLite model from Hugging Face...")
tflite_path = hf_hub_download(repo_id=REPO_ID, filename=MODEL_FILENAME)

# Load TFLite interpreter
interpreter = tf.lite.Interpreter(model_path=tflite_path)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

@app.get("/")
def read_root():
    return {"status": "online", "model": "AlertDrive AI Quantized TFLite"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and preprocess the uploaded image
        contents = await file.read()
        image = PIL.Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224))

        # Normalize image to match model configuration [1, 224, 224, 3]
        img_array = np.array(image, dtype=np.float32) / 255.0
        input_data = np.expand_dims(img_array, axis=0)

        # Run TFLite inference
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])

        probability = float(output_data[0][0])

        # Classification Logic
        if probability > 0.5:
            status = "NATURAL"
            confidence = probability * 100
        else:
            status = "DROWSY"
            confidence = (1.0 - probability) * 100

        return {
            "success": True,
            "status": status,
            "confidence_percentage": round(confidence, 2),
            "raw_score": probability
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
