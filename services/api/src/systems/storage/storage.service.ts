import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import {
  FILE_DEFAULT_CONTENT_TYPE,
  STORAGE_ROOT_DIRECTORY,
} from './storage.constants';

import { AppConfigService } from 'src/config/app-config.service';
import { ErrorMessagesEnum } from 'src/common/enums';
import { IMultipartFile } from './interfaces';
import { join, parse } from 'node:path';
import { error } from 'node:console';
import { FileEntity } from 'src/modules/files/file.entity';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private readonly minioClient: Client;
  private readonly bucket: string;

  constructor(private readonly configService: AppConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get('MINIO_HOST'),
      port: parseInt(this.configService.get('MINIO_PORT'), 10),
      useSSL: this.configService.get('MINIO_USE_SSL'),
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucket = this.configService.get('MINIO_BUCKET');
  }

  public async selectOneData(path: string): Promise<Partial<IMultipartFile>> {
    const fileObj = await this.minioClient.getObject(this.bucket, path);
    const fileStat = await this.minioClient.statObject(this.bucket, path);
    const mimetype = fileStat.metaData['content-type'];

    const chunks = [];
    for await (const chunk of fileObj) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks);
    return { data, mimetype };
  }

  public async createOne(
    file: IMultipartFile,
    pathToFile: string,
  ): Promise<Promise<Partial<FileEntity>>> {
    const { data, filename, mimetype } = file;
    const { ext } = parse(filename);
    const actualFileName = Date.now() + '-' + filename;
    const pathInStorage = join(
      STORAGE_ROOT_DIRECTORY,
      pathToFile,
      actualFileName,
    ).replace(/\\/g, '/');
    const uploadMetadata = {
      'Content-Type': mimetype ?? FILE_DEFAULT_CONTENT_TYPE,
    };

    try {
      await this.minioClient.putObject(
        this.bucket,
        pathInStorage,
        data,
        undefined,
        uploadMetadata,
      );
      this.logger.verbose(
        `MINIO UPLOADED FILE | BUCKET: ${this.bucket}; PATH TO FILE: ${pathInStorage}. Result: SUCCESS`,
        error,
      );
      return {
        fileName: filename,
        fileExt: ext,
        fileNameWithExt: actualFileName,
        pathInStorage,
        mimetype,
      };
    } catch (error) {
      this.logger.error(
        `MINIO UPLOAD ERROR | BUCKET: ${this.bucket}; PATH TO FILE: ${pathInStorage}. Result: FAILED`,
        error,
      );
      await this.deleteOne(pathInStorage);
      throw new BadRequestException(ErrorMessagesEnum.FILE_UPLOAD_ERROR);
    }
  }

  public async deleteOne(pathInStorage: string): Promise<void> {
    await this.minioClient
      .removeObject(this.bucket, pathInStorage)
      .catch(() => {
        throw new BadRequestException(ErrorMessagesEnum.FILE_DELETION_ERROR);
      });
  }
}
