import { ConfigService } from '@nestjs/config';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as path from 'path';
import { CommonEntity } from 'src/common/entities';
import { AppConfigService } from 'src/config/app-config.service';
import { Column, Entity } from 'typeorm';

const appConfigService = new AppConfigService(new ConfigService());

@Entity('files')
export class FileEntity extends CommonEntity {
  @ApiProperty({ type: 'string', maxLength: 256, required: true })
  @Column({ type: 'varchar', length: 256 })
  public readonly fileName: string;

  @ApiProperty({ type: 'string', maxLength: 256, required: true })
  @Column({ type: 'varchar', length: 256 })
  public readonly fileExt: string;

  @ApiProperty({ type: 'string', maxLength: 512, required: true })
  @Column({ type: 'varchar', length: 512 })
  public readonly fileNameWithExt: string;

  @ApiProperty({ type: 'string', maxLength: 512, required: true })
  @Column({ type: 'varchar', length: 512 })
  public readonly pathInStorage: string;

  @ApiProperty({ type: 'string', maxLength: 256, required: true })
  @Column({ type: 'varchar', length: 256 })
  public readonly mimetype: string;

  @Expose()
  @ApiProperty({ readOnly: true })
  get src(): string {
    if (!this.pathInStorage) return null;
    const filePath = path
      .join(appConfigService.get('CDN'), this.pathInStorage)
      .replace(/\\/g, '/');

    return new URL(filePath).toString();
  }
}
