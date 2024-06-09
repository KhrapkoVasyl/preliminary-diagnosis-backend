import logging
from fastapi import FastAPI
from app.services.rabbitmq_connection_service import RabbitMQConnectionService
from app.services.rabbitmq_consumer_service import RabbitMQConsumerService

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

rabbitmq_connection_service = RabbitMQConnectionService()
rabbitmq_consumer_service = RabbitMQConsumerService(rabbitmq_connection_service)

