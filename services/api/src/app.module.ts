import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './systems/database';
import { FilesModule } from './modules/files';

@Module({
  imports: [AppConfigModule, DatabaseModule, FilesModule],
})
export class AppModule {}
