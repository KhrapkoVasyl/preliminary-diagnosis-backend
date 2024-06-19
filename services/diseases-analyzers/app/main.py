import logging
import time
from fastapi import FastAPI
from app.services.rabbitmq_connection_service import RabbitMQConnectionService
from app.services.rabbitmq_consumer_service import RabbitMQConsumerService
from app.services.rabbitmq_publisher_service import RabbitMQPublisherService
from app.services.storage_service import StorageService
from app.services.disease_analyzer_service import DiseaseAnalyzerService

time.sleep(17)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

storage_service = StorageService()
disease_analyzer_service = DiseaseAnalyzerService(storage_service)
rabbitmq_connection_service = RabbitMQConnectionService()
rabbitmq_publisher_service = RabbitMQPublisherService(rabbitmq_connection_service)
rabbitmq_consumer_service = RabbitMQConsumerService(rabbitmq_connection_service, rabbitmq_publisher_service, storage_service, disease_analyzer_service)
