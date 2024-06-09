import json

import pika
from app.services.rabbitmq_connection_service import RabbitMQConnectionService

class RabbitMQPublisherService:
    def __init__(self, rabbitmq_connection_service: RabbitMQConnectionService):
        self.rabbitmq_connection_service = rabbitmq_connection_service

    def add_message_to_queue(self, queue: str, message_data: dict):
        channel = self.rabbitmq_connection_service.get_channel()
        self.rabbitmq_connection_service.assert_queue(queue)
        channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=self.convert_data(message_data),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        print(f"Message sent to queue ({queue}) with task data {message_data}")

    def convert_data(self, data: dict) -> bytes:
        return json.dumps(data).encode('utf-8')
