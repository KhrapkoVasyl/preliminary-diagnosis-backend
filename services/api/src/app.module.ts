import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './systems/database';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
