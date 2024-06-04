import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './systems/database';
import { FilesModule } from './modules/files';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth/auth.module';
import { StudyTypesModule } from './modules/study-types';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    StudyTypesModule,
    FilesModule,
  ],
})
export class AppModule {}
