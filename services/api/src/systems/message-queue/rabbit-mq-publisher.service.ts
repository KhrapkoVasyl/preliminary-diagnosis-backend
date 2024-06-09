import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQConnectionService } from './rabbit-mq-connection.service';

@Injectable()
export class RabbitMQPublisherService {
  private readonly logger = new Logger(RabbitMQPublisherService.name);

  constructor(
    private readonly rabbitMQConnectionService: RabbitMQConnectionService,
  ) {}

  async addMessageToQueue(queue: string, messageData: unknown) {
    const channel = this.rabbitMQConnectionService.getChannel();
    await this.rabbitMQConnectionService.assertQueue(queue);
    channel.sendToQueue(queue, this.convertData(messageData), {
      persistent: true,
    });

    this.logger.debug(
      `Message sent to queue (${queue}) with task data ${messageData}`,
    );
  }

  convertData(data: unknown) {
    return Buffer.from(JSON.stringify(data));
  }
}
