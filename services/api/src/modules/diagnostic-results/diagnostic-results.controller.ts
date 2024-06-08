import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DiagnosticResultsService } from './diagnostic-results.service';
import { DiagnosticResultEntity } from './diagnostic-result.entity';
import { IdDto } from 'src/common/dto';
import { CreateDiagnosticDto, UpdateDiagnosticDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards';
import { Role } from '../auth/decorators';
import { UserRoleEnum } from '../users/enums';

@ApiTags('diagnostic-results')
@Controller('diagnostic-results')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DiagnosticResultsController {
  constructor(
    private readonly diagnosticResultsService: DiagnosticResultsService,
  ) {}

  @Get()
  findAll(): Promise<DiagnosticResultEntity[]> {
    return this.diagnosticResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<DiagnosticResultEntity> {
    return this.diagnosticResultsService.findOne(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Post()
  createOne(
    @Body() createEntityDto: CreateDiagnosticDto,
  ): Promise<DiagnosticResultEntity> {
    const model = plainToInstance(DiagnosticResultEntity, createEntityDto);

    return this.diagnosticResultsService.createOne(model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch(':id')
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateDiagnosticDto,
  ): Promise<DiagnosticResultEntity> {
    const model = plainToInstance(DiagnosticResultEntity, updateEntityDto);

    return this.diagnosticResultsService.updateOne(conditions, model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteOne(@Param() conditions: IdDto): Promise<DiagnosticResultEntity> {
    return this.diagnosticResultsService.deleteOne(conditions);
  }
}
