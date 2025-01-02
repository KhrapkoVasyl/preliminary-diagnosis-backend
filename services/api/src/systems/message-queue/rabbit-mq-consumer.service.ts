import { Injectable, Logger } from '@nestjs/common';
import { DiagnosticsService } from 'src/modules/diagnostics/diagnostics.service';
import { RabbitMQConnectionService } from './rabbit-mq-connection.service';
import { Channel, ConsumeMessage } from 'amqplib';
import { MessageQueueName } from './enums';
import { DiagnosticResultData } from 'src/modules/diagnostics/types';

@Injectable()
export class RabbitMQConsumerService {
  private readonly logger = new Logger(RabbitMQConsumerService.name);

  constructor(
    private readonly rabbitMQConnectionService: RabbitMQConnectionService,
    private readonly diagnosticsService: DiagnosticsService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQConnectionService.setUpConnection();

    const channel = this.rabbitMQConnectionService.getChannel();
    await this.setUpDiagnosticResultHandler(channel);
  }

  async setUpDiagnosticResultHandler(channel: Channel) {
    const queue = MessageQueueName.DIAGNOSTIC_RESULT;
    await this.rabbitMQConnectionService.assertQueue(queue);
    await channel.consume(
      queue,
      this.handleDiagnosticResultMessage.bind(this, channel),
    );
  }

  async handleDiagnosticResultMessage(channel: Channel, msg: ConsumeMessage) {
    let data = null;
    try {
      data = this.getMessageData<DiagnosticResultData>(msg);
      await this.diagnosticsService.handleDiagnosticResult(data);
      channel.ack(msg);
    } catch (err) {
      this.handleError(err, msg, data);
    }
  }

  getMessageData<T extends object>(msg: ConsumeMessage): T {
    return JSON.parse(msg.content.toString());
  }

  handleError(err: Error, msg?: ConsumeMessage, data?: unknown) {
    this.logger.error(
      `Error ${err}, when handling message:`,
      msg,
      'Message data: ',
      data,
    );
  }
}
