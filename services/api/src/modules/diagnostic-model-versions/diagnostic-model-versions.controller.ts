import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DiagnosticModelVersionsService } from './diagnostic-model-versions.service';
import { DiagnosticModelVersionEntity } from './diagnostic-model-version.entity';
import { IdDto } from 'src/common/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards';

@ApiTags('diagnostic-model-versions')
@Controller('diagnostic-models-versions')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DiagnosticModelVersionsController {
  constructor(
    private readonly diagnosticModelVersionsService: DiagnosticModelVersionsService,
  ) {}

  @Get()
  findAll(): Promise<DiagnosticModelVersionEntity[]> {
    return this.diagnosticModelVersionsService.findAll();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<DiagnosticModelVersionEntity> {
    return this.diagnosticModelVersionsService.findOne(conditions);
  }
}
