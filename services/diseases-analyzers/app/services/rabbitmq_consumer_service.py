import json
import os
import logging
from app.services.rabbitmq_connection_service import RabbitMQConnectionService
from app.services.rabbitmq_publisher_service import RabbitMQPublisherService
from app.services.storage_service import StorageService
from app.services.disease_analyzer_service import DiseaseAnalyzerService

class RabbitMQConsumerService:
    def __init__(self, rabbitmq_connection_service: RabbitMQConnectionService, rabbitmq_publisher_service: RabbitMQPublisherService, storage_service: StorageService, disease_analyzer_service: DiseaseAnalyzerService):
        self.logger = logging.getLogger(__name__)
        self.rabbitmq_connection_service = rabbitmq_connection_service
        self.rabbitmq_publisher_service = rabbitmq_publisher_service
        self.storage_service = storage_service
        self.disease_analyzer_service = disease_analyzer_service
        self.queue_name = os.getenv('RABBIT_MQ_QUEUE_NAME')
        self.result_queue_name = os.getenv('RABBIT_MQ_RESULT_QUEUE_NAME')
        self.rabbitmq_connection_service.set_up_connection()
        channel = self.rabbitmq_connection_service.get_channel()
        self.set_up_analyze_disease_handler(channel)


    def set_up_analyze_disease_handler(self, channel):
        self.rabbitmq_connection_service.assert_queue(self.queue_name)
        self.logger.debug(f"Starting to consume from queue: {self.queue_name}")
        channel.basic_consume(
            queue=self.queue_name,
            on_message_callback=self.handle_diagnostic_result_message,
            auto_ack=False,
        )
        channel.start_consuming()

    def handle_diagnostic_result_message(self, ch, method, properties, body):
        self.logger.debug(f"Received message: {body}")
        data = self.get_message_data(body)
        try:
            self.logger.debug(f"Data: {data}")
            self.handle_diagnostic_result(data)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as err:
            self.handle_error(data, ch, method, body, str(err))

    def get_message_data(self, body):
        return json.loads(body)

    def handle_diagnostic_result(self, data):
        result_id = data.get('resultId')
        image_path_in_storage = data.get('imagePathInStorage')
        if not result_id or not image_path_in_storage:
            raise ValueError("Missing required data in message")
        buffer = self.storage_service.read_file_to_buffer(image_path_in_storage)
        if not buffer:
            raise ValueError(f"File by specified path (${image_path_in_storage}) not found!")        
        diseaseProbability = self.disease_analyzer_service.analyze_disease(buffer)
        result_data = {
            'resultId': result_id,
            'status': 'COMPLETED',
            'diseaseProbability': diseaseProbability,  
        }        
        self.rabbitmq_publisher_service.add_message_to_queue(self.result_queue_name, result_data)

    def handle_error(self, data, ch, method, body, err_message):
        self.logger.debug(f"Finishing validation with FAIL. Message body: {body}. Reason: {err_message}")
        result_id = data.get('resultId', 'unknown')
        failed_message_data = {
                'resultId': result_id,
                'status': 'FAILED'
            }
        self.rabbitmq_publisher_service.add_message_to_queue(self.result_queue_name, failed_message_data)
        ch.basic_ack(delivery_tag=method.delivery_tag)

