import { Module } from '@nestjs/common';
import { StudyTypeEntity } from './study-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyTypesService } from './study-types.service';
import { StudyTypesController } from './study-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudyTypeEntity])],
  controllers: [StudyTypesController],
  providers: [StudyTypesService],
  exports: [StudyTypesService],
})
export class StudyTypesModule {}
