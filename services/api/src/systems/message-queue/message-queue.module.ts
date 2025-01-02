import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQPublisherService } from './rabbit-mq-publisher.service';
import { AppConfigModule } from 'src/config';
import { RabbitMQConsumerService } from './rabbit-mq-consumer.service';
import { RabbitMQConnectionService } from './rabbit-mq-connection.service';
import { DiagnosticsModule } from 'src/modules/diagnostics';

@Module({
  imports: [AppConfigModule, forwardRef(() => DiagnosticsModule)],
  providers: [
    RabbitMQConnectionService,
    RabbitMQPublisherService,
    RabbitMQConsumerService,
  ],
  exports: [RabbitMQPublisherService],
})
export class MessageQueueModule {}
