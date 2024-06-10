import tensorflow as tf
import io
import os
import logging
from app.services.storage_service import StorageService
from dotenv import load_dotenv
import tempfile

load_dotenv()

class DiseaseAnalyzerService:
    def __init__(self, storage_service: StorageService):
        self.logger = logging.getLogger(__name__)
        self.storage_service = storage_service
        self.model = self.load_model(os.getenv('MODEL_PATH'))

    def load_model(self, model_path):
        try:
            self.logger.debug(f"Loading model from: {model_path}")
            buffer = self.storage_service.read_file_to_buffer(model_path)
            with tempfile.NamedTemporaryFile(delete=False) as temp_model_file:
                temp_model_file.write(buffer.getvalue())
                temp_model_path = temp_model_file.name
            model = tf.keras.models.load_model(temp_model_path)
            self.logger.info("Model loaded successfully")
            os.remove(temp_model_path)
            return model
        except Exception as e:
            self.logger.error(f"Failed to load model: {e}")
            raise e

    def analyze_disease(self, image_buffer):
        try:
            image = tf.io.decode_image(image_buffer.getvalue(), channels=3)
            image = tf.image.resize(image, [224, 224])
            image = tf.expand_dims(image, axis=0)
            prediction = self.model.predict(image)
            self.logger.debug(f"PREDICTION: {prediction}")
            disease_probability = prediction[0][0]
            self.logger.debug(f"Disease probability: {disease_probability}")
            return disease_probability
        except Exception as e:
            self.logger.error(f"Failed to analyze disease: {e}")
            raise e
