import { Module } from '@nestjs/common';
import { DiagnosticTypeEntity } from './diagnostic-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticTypesService } from './diagnostic-types.service';
import { DiagnosticTypesController } from './diagnostic-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticTypeEntity])],
  controllers: [DiagnosticTypesController],
  providers: [DiagnosticTypesService],
  exports: [DiagnosticTypesService],
})
export class DiagnosticTypesModule {}
