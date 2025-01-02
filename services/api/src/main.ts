import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import multipart from '@fastify/multipart';
import { validationPipe } from './common/pipes';
import { AppConfigService } from './config/app-config.service';
import { StorageProxyMiddleware } from './systems/storage/storage-proxy.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get<AppConfigService>(AppConfigService);

  await app.register(multipart, {
    addToBody: true,
    limits: {
      fileSize: configService.get<number>('FILE_SIZE_LIMIT'),
    },
  });

  const HOST = configService.get<string>('NEST_HOST');
  const PORT = configService.get<number | string>('NEST_PORT');
  const GLOBAL_PREFIX = configService.get<string>('GLOBAL_PREFIX');

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const storageProxyMiddleware = new StorageProxyMiddleware(configService);
  app.use(
    configService.get('STATIC_FILES_PREFIX'),
    storageProxyMiddleware.use.bind(storageProxyMiddleware),
  );
  app.enableCors();

  const ENABLE_SWAGGER = configService.get<boolean>('ENABLE_SWAGGER');
  if (ENABLE_SWAGGER) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get('npm_package_name'))
      .setVersion(configService.get('npm_package_version'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    const SWAGGER_DOCS_PATH = configService.get<string>('SWAGGER_DOCS_PATH');
    SwaggerModule.setup(SWAGGER_DOCS_PATH, app, document);
  }

  app.useGlobalPipes(validationPipe);

  await app.listen(PORT, HOST, () => {
    console.log(`Nest.js server started`);
  });
}

setTimeout(() => bootstrap(), 10000);
