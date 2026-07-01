from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import contextlib

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'best_model_efficientnet.keras')
DATASET_DIR = os.path.join(os.path.dirname(__file__), '..', 'Dataset')

ml_models = {}
class_names = []

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Loading model...")
    ml_models["model"] = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded.")
    
    # Generate class names
    labels = []
    if os.path.exists(DATASET_DIR):
        for script_dir in os.listdir(DATASET_DIR):
            script_path = os.path.join(DATASET_DIR, script_dir)
            if os.path.isdir(script_path):
                for char_dir in os.listdir(script_path):
                    if os.path.isdir(os.path.join(script_path, char_dir)):
                        labels.append(f"{script_dir}_{char_dir}")
        global class_names
        class_names = sorted(labels)
        print(f"Loaded {len(class_names)} classes.")
    else:
        print("Dataset directory not found for class extraction!")
    yield
    # Shutdown logic (if any)
    ml_models.clear()

app = FastAPI(title="Aksara Nusantara API", lifespan=lifespan)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with exact frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)
    # EfficientNet in Keras handles normalization internally
    return img_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    model = ml_models.get("model")
    if not model:
        return JSONResponse(status_code=500, content={"error": "Model not loaded"})
    
    try:
        contents = await file.read()
        img_array = preprocess_image(contents)
        
        predictions = model.predict(img_array)
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        
        if class_names and predicted_idx < len(class_names):
            predicted_class = class_names[predicted_idx]
        else:
            predicted_class = f"Class Index {predicted_idx}"
            
        return {
            "prediction": predicted_class,
            "confidence": f"{confidence * 100:.2f}%"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/")
def read_root():
    return {"message": "Welcome to Aksara Nusantara Classifier API"}
