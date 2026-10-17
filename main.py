import os
import io
import numpy as np
import PIL.Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Try importing lightweight TFLite runtime first, fallback to TensorFlow
try:
    import tflite_runtime.interpreter as tflite
    Interpreter = tflite.Interpreter
except ImportError:
    try:
        from ai_edge_litert import interpreter as tflite
        Interpreter = tflite.Interpreter
    except ImportError:
        import tensorflow as tf
        Interpreter = tf.lite.Interpreter

app = FastAPI(
    title="AlertDrive AI API",
    description="Driver Drowsiness Detection API powered by Quantized TFLite",
    version="1.0.0"
)

# Enable CORS for Flutter/React Native/Web app integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_FILENAME = "alertdrive_model_quantized.tflite"
REPO_ID = "btehubsolutions/alertdrive-model"

# Resolve model path: prioritize local repository model file for fast cold boot
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
local_model_path = os.path.join(BASE_DIR, MODEL_FILENAME)

if os.path.exists(local_model_path) and os.path.getsize(local_model_path) > 1000000:
    print(f"Loading local TFLite model from: {local_model_path}")
    tflite_path = local_model_path
else:
    print(f"Local model not found or is LFS pointer. Downloading from Hugging Face ({REPO_ID})...")
    from huggingface_hub import hf_hub_download
    tflite_path = hf_hub_download(repo_id=REPO_ID, filename=MODEL_FILENAME)

# Load TFLite interpreter
interpreter = Interpreter(model_path=tflite_path)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AlertDrive AI API",
        "model": "AlertDrive AI Quantized TFLite",
        "input_shape": input_details[0]["shape"].tolist()
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/dashboard")
@app.get("/dms")
def serve_client_dashboard():
    dashboard_path = os.path.join(BASE_DIR, "alertdrive_client_dms.html")
    if os.path.exists(dashboard_path):
        return FileResponse(dashboard_path, media_type="text/html")
    raise HTTPException(status_code=404, detail="Client dashboard not found.")

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    invert: bool = False
):
    try:
        # Validate uploaded content type
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

        # Read and preprocess the uploaded image
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded.")

        image = PIL.Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224))

        # Normalize image to match model configuration [1, 224, 224, 3]
        img_array = np.array(image, dtype=np.float32) / 255.0
        input_data = np.expand_dims(img_array, axis=0)

        # Run TFLite inference
        interpreter.set_tensor(input_details[0]["index"], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]["index"])

        probability = float(output_data[0][0])

        # Dual interpretation handling
        # Standard: 0 = Natural / Alert, 1 = Drowsy
        # Inverted: 0 = Drowsy, 1 = Natural / Alert
        if invert:
            is_drowsy = probability <= 0.5
            confidence = (1.0 - probability) * 100.0 if is_drowsy else probability * 100.0
        else:
            is_drowsy = probability > 0.5
            confidence = probability * 100.0 if is_drowsy else (1.0 - probability) * 100.0

        status = "DROWSY" if is_drowsy else "NATURAL"

        return {
            "success": True,
            "status": status,
            "confidence_percentage": round(confidence, 2),
            "raw_score": probability,
            "p_drowsy": round(probability * 100.0, 2),
            "p_natural": round((1.0 - probability) * 100.0, 2)
        }
    except HTTPException:
        raise
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
