import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnvEnum } from 'src/common/enums';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get<T>(key: string): T {
    const value = this.configService.get<T>(key);
    if (!value) throw new Error(key + ' env variable not set');

    try {
      return JSON.parse(value as string);
    } catch {
      return value;
    }
  }

  public isNodeEnv(mode: NodeEnvEnum): boolean {
    return this.get('NODE_ENV') === mode;
  }
}
