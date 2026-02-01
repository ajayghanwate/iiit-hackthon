import cv2
import numpy as np
from deepface import DeepFace
import io
from PIL import Image
import tensorflow as tf

# Allow memory growth so it doesn't grab everything at once
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(f"Memory growth error: {e}")

# Global variable to hold the pre-loaded model
_face_model = None

def warmup():
    """
    Pre-loads the VGG-Face model and OpenCV detector.
    This should be called during application startup.
    """
    global _face_model
    print("Initializing face recognition models...")
    # Build model explicitly to cache it
    _face_model = DeepFace.build_model("VGG-Face")
    # Also trigger a dummy represent to initialize the detector
    dummy_img = np.zeros((224, 224, 3), dtype=np.uint8)
    DeepFace.represent(dummy_img, model_name="VGG-Face", detector_backend="opencv", enforce_detection=False)
    print("Face recognition models initialized successfully.")

def _bytes_to_array(image_bytes: bytes):
    """
    Convert image bytes to a numpy array for OpenCV/DeepFace.
    """
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != "RGB":
        image = image.convert("RGB")
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

def process_classroom_image(image_bytes: bytes):
    """
    Detect multiple faces in a classroom image and generate embeddings for each.
    """
    try:
        img_array = _bytes_to_array(image_bytes)
        
        # Detect and represent all faces in the image
        results = DeepFace.represent(
            img_path=img_array,
            model_name="VGG-Face",
            detector_backend="opencv",
            enforce_detection=False
        )
        
        embeddings = []
        for res in results:
            if "embedding" in res:
                embeddings.append(res["embedding"])
        
        return embeddings
    except Exception as e:
        print(f"Error processing classroom image: {e}")
        return []

def get_single_face_embedding(image_bytes: bytes):
    """
    Detect exactly one face and return its embedding.
    Throws error if 0 or >1 face detected.
    """
    try:
        img_array = _bytes_to_array(image_bytes)
        
        # We catch the exception from DeepFace to provide a better error message
        try:
            results = DeepFace.represent(
                img_path=img_array,
                model_name="VGG-Face",
                detector_backend="opencv",
                enforce_detection=True
            )
        except Exception as e:
            if "Face could not be detected" in str(e):
                raise ValueError("No face detected. Please ensure the photo is clear and the face is fully visible.")
            raise e
        
        if len(results) == 0:
            raise ValueError("No face detected in the image.")
        if len(results) > 1:
            raise ValueError("Multiple faces detected. Please upload an image with only one face for registration.")
        
        return results[0]["embedding"]
    except Exception as e:
        raise e
