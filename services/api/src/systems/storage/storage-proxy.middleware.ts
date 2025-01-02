import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class StorageProxyMiddleware implements NestMiddleware {
  private proxy;

  constructor(private configService: AppConfigService) {
    const storageHost = this.configService.get<string>('MINIO_HOST');
    const storagePort = this.configService.get<string>('MINIO_PORT');
    const staticFilesPrefix = this.configService.get<string>(
      'STATIC_FILES_PREFIX',
    );
    const storageUrl = `http://${storageHost}:${storagePort}`;

    this.proxy = createProxyMiddleware({
      target: storageUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^${staticFilesPrefix}`]: '',
      },
    });
  }

  use(req: any, res: any, next: () => void) {
    this.proxy(req, res, next);
  }
}
