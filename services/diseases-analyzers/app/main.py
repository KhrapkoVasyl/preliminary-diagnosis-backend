import logging
import time
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from app.services.rabbitmq_connection_service import RabbitMQConnectionService
from app.services.rabbitmq_consumer_service import RabbitMQConsumerService
from app.services.rabbitmq_publisher_service import RabbitMQPublisherService
from app.services.storage_service import StorageService
from app.services.disease_analyzer_service import DiseaseAnalyzerService
from app.config import ENV_FILE

load_dotenv(ENV_FILE)

time.sleep(17)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.debug(f"ENV PARAM - MODEL_PATH: {os.getenv('MODEL_PATH')}")
logger.debug(f"ENV PARAM - RABBIT_MQ_QUEUE_NAME: {os.getenv('RABBIT_MQ_QUEUE_NAME')}")

app = FastAPI()

storage_service = StorageService()
disease_analyzer_service = DiseaseAnalyzerService(storage_service)
rabbitmq_connection_service = RabbitMQConnectionService()
rabbitmq_publisher_service = RabbitMQPublisherService(rabbitmq_connection_service)
rabbitmq_consumer_service = RabbitMQConsumerService(rabbitmq_connection_service, rabbitmq_publisher_service, storage_service, disease_analyzer_service)
