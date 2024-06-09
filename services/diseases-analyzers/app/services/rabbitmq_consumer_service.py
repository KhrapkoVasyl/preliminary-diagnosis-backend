import json
import os
from app.services.rabbitmq_connection_service import RabbitMQConnectionService

class RabbitMQConsumerService:
    def __init__(self, rabbitmq_connection_service: RabbitMQConnectionService):
        self.rabbitmq_connection_service = rabbitmq_connection_service
        self.queue_name = os.getenv('RABBIT_MQ_QUEUE_NAME')
        self.rabbitmq_connection_service.set_up_connection()
        channel = self.rabbitmq_connection_service.get_channel()
        self.set_up_diagnostic_result_handler(channel)


    def set_up_diagnostic_result_handler(self, channel):
        self.rabbitmq_connection_service.assert_queue(self.queue_name)
        channel.basic_consume(
            queue=self.queue_name,
            on_message_callback=self.handle_diagnostic_result_message,
            auto_ack=False
        )

    def handle_diagnostic_result_message(self, ch, method, properties, body):
        try:
            data = self.get_message_data(body)
            self.handle_diagnostic_result(data)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as err:
            self.handle_error(err, body)

    def get_message_data(self, body):
        return json.loads(body)

    def handle_diagnostic_result(self, data):
        print(f"Handling diagnostic result: {data}")
        # TODO: implement handling 

    def handle_error(self, err, body):
        print(f"Error {err}, when handling message: {body}")
