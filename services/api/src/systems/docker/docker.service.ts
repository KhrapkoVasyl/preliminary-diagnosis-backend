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
  private prefix: string;

  constructor(private readonly configService: AppConfigService) {
    const socketPath = this.configService.get('DOCKER_SOCKET_PATH');
    this.docker = new Docker({ socketPath });
    this.network = this.configService.get('DOCKER_NETWORK');
    this.diseaseAnalyzerServiceImageName = this.configService.get(
      'DOCKER_DISEASES_ANALYZER_SERVICE_IMAGE',
    );
    this.prefix = this.configService.get(
      'DOCKER_SDOCKER_DISEASES_ANALYZER_SERVICE_NAME_PREFIX',
    );
  }

  async listContainers(onlyActive: boolean = true) {
    try {
      const containers = await this.docker.listContainers({ all: !onlyActive });

      return containers;
    } catch (error) {
      this.logger.error('Failed to list containers', error);
      throw error;
    }
  }

  async findActiveContainerByEnv(envVar: string, value: string) {
    try {
      const containers = await this.docker.listContainers({ all: false });
      for (const containerInfo of containers) {
        const container = this.docker.getContainer(containerInfo.Id);
        const details = await container.inspect();
        const envs = details.Config.Env;
        const envValue = envs.find((env: string) =>
          env.startsWith(`${envVar}=`),
        );
        if (envValue && envValue.split('=')[1] === value) {
          return details;
        }
      }
      return null;
    } catch (error) {
      this.logger.error('Failed to find container by env', error);
      throw error;
    }
  }

  async startOneDiseaseAnalyzerContainer(
    containerPrefix: string,
    pathToModel: string,
    queueName: string,
  ) {
    const existingContainer = await this.findActiveContainerByEnv(
      'RABBIT_MQ_QUEUE_NAME',
      queueName,
    );

    if (!existingContainer) {
      await this.startDiseaseAnalyzerContainer(
        containerPrefix,
        pathToModel,
        queueName,
      );
    }
  }

  async startDiseaseAnalyzerContainer(
    containerPrefix: string,
    pathToModel: string,
    queueName: string,
  ) {
    const name = `${this.prefix}-${containerPrefix}-` + generateRandomString(6);

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
      this.logger.debug(`Container ${containerName} started successfully`);
    } catch (error) {
      this.logger.error(`Failed to start container ${containerName}`, error);
    }
  }
}
