import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AppConfigService } from 'src/config/app-config.service';
import { DiagnosticModelsService } from 'src/modules/diagnostic-models/diagnostic-models.service';

@Injectable()
export class RabbitMQConnectionService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQConnectionService.name);

  private readonly rabbitMQProtocol =
    this.configService.get<string>('RABBIT_MQ_PROTOCOL');
  private readonly rabbitMQHost =
    this.configService.get<string>('RABBIT_MQ_HOST');
  private readonly rabbitMQUser = this.configService.get<string>(
    'RABBITMQ_DEFAULT_USER',
  );
  private readonly rabbitMQPassword = this.configService.get<string>(
    'RABBITMQ_DEFAULT_PASS',
  );
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(
    private readonly configService: AppConfigService,
    private readonly diagnosticModelsService: DiagnosticModelsService,
  ) {}

  async onModuleInit() {
    await this.setUpConnection();
  }

  async setUpConnection() {
    this.connection = await amqp.connect(
      `${this.rabbitMQProtocol}://${this.rabbitMQUser}:${this.rabbitMQPassword}@${this.rabbitMQHost}`,
    );
    this.channel = await this.connection.createChannel();
    await this.assertQueueForModels();
  }

  async assertQueue(queue: string) {
    this.logger.debug(`Asserting queue - ${queue}`);
    await this.channel.assertQueue(queue, { durable: true });
  }

  async assertQueueForModels() {
    const modelQueueNames =
      await this.diagnosticModelsService.selectModelQueueNames();

    for (const modelQueueName of modelQueueNames) {
      await this.assertQueue(modelQueueName);
    }
  }

  getChannel() {
    return this.channel;
  }
}
