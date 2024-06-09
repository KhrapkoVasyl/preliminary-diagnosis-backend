import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { AppConfigModule } from 'src/config';
import { RabbitMQConsumerService } from './rabbit-mq-consumer.service';
import { DiagnosticModelsModule } from 'src/modules/diagnostic-models';
import { RabbitMQConnectionService } from './rabbit-mq-connection.service';

@Module({
  imports: [AppConfigModule, DiagnosticModelsModule],
  providers: [
    RabbitMQConnectionService,
    RabbitMQService,
    RabbitMQConsumerService,
  ],
  exports: [RabbitMQService],
})
export class MessageQueueModule {}
