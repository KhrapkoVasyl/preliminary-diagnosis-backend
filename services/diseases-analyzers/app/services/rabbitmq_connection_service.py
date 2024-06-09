import os
import pika
from dotenv import load_dotenv
import logging

load_dotenv()

class RabbitMQConnectionService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.rabbitmq_host = os.getenv('RABBIT_MQ_HOST')
        self.rabbitmq_port = os.getenv('RABBIT_MQ_PORT')
        self.rabbitmq_user = os.getenv('RABBIT_MQ_DEFAULT_USER')
        self.rabbitmq_password = os.getenv('RABBIT_MQ_DEFAULT_PASS')
        self.connection = None
        self.channel = None


    def set_up_connection(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=self.rabbitmq_host,
                port=self.rabbitmq_port,
                credentials=pika.PlainCredentials(
                    self.rabbitmq_user,
                    self.rabbitmq_password
                )
            )
        )
        self.channel = self.connection.channel()

    def assert_queue(self, queue: str):
        self.logger.debug(f"Asserting queue - {queue}")
        self.channel.queue_declare(queue=queue, durable=True)

    def get_channel(self):
        return self.channel
