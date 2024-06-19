import { Injectable, Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import { generateRandomString } from 'src/common/helpers';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);

  private docker: Docker;
  private network: string;
  private diseaseAnalyzerServiceImageName: string;

  constructor(private readonly configService: AppConfigService) {
    const socketPath = this.configService.get('DOCKER_SOCKET_PATH');
    this.docker = new Docker({ socketPath });
    this.network = this.configService.get('DOCKER_NETWORK');
    this.diseaseAnalyzerServiceImageName = this.configService.get(
      'DOCKER_DISEASES_ANALYZER_SERVICE_IMAGE',
    );
  }

  async startDiseaseAnalyzerContainer(
    containerPrefix: string,
    pathToModel: string,
    queueName: string,
  ) {
    const name = containerPrefix + generateRandomString(6);
    console.log('\n\nName: ', name, '\n\n');

    return this.createAndStartContainer(
      this.diseaseAnalyzerServiceImageName,
      name,
      this.network,
      {
        APP_MODE: 'production',
        MODEL_PATH: pathToModel,
        RABBIT_MQ_QUEUE_NAME: queueName,
      },
    );
  }

  async createAndStartContainer(
    image: string,
    containerName: string,
    network?: string,
    envVars: Record<string, string> = {},
  ) {
    const env = Object.entries(envVars).map(
      ([key, value]) => `${key}=${value}`,
    );

    try {
      const container = await this.docker.createContainer({
        Image: image,
        name: containerName,
        Env: env,
        HostConfig: {
          NetworkMode: network,
        },
      });

      await container.start();
      console.log(`Container ${containerName} started successfully`);
    } catch (error) {
      console.error(`Failed to start container ${containerName}`, error);
    }
  }
}
