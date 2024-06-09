import os
from minio import Minio
from minio.error import S3Error
import io
from dotenv import load_dotenv
import logging

load_dotenv()

class StorageService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.bucket_name = os.getenv('MINIO_BUCKET')
        self.client = Minio(
            endpoint=os.getenv('MINIO_BASE_URL'),
            access_key=os.getenv('MINIO_ACCESS_KEY'),
            secret_key=os.getenv('MINIO_SECRET_KEY'),
            secure=os.getenv('MINIO_USE_SSL').lower() == 'true'
        )

    def read_file_to_buffer(self, file_path):
        try:
            self.logger.debug(f"Attempting to read file from path: {file_path}")
            response = self.client.get_object(self.bucket_name, file_path)
            buffer = io.BytesIO(response.read())
            response.close()
            response.release_conn()
            self.logger.info(f"Successfully read file from path: {file_path}")
            return buffer
        except S3Error as err:
            self.logger.error(f"Error occurred while reading file (path - {file_path}). Error: {err}")
            return None