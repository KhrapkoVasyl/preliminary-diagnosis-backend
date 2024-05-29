import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './systems/database';
import { FilesModule } from './modules/files';
import { UsersModule } from './modules/users';

@Module({
  imports: [AppConfigModule, DatabaseModule, UsersModule, FilesModule],
})
export class AppModule {}
