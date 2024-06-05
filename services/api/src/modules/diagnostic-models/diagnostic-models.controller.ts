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
import { DiagnosticModelsService } from './diagnostic-models.service';
import { DiagnosticModelEntity } from './diagnostic-model.entity';
import { IdDto } from 'src/common/dto';
import { CreateGenreDto, UpdateGenreDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards';
import { Role } from '../auth/decorators';
import { UserRoleEnum } from '../users/enums';

@ApiTags('diagnostic-models')
@Controller('diagnostic-models')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DiagnosticModelsController {
  constructor(
    private readonly diagnosticModelsService: DiagnosticModelsService,
  ) {}

  @Get()
  findAll(): Promise<DiagnosticModelEntity[]> {
    return this.diagnosticModelsService.findAll();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelsService.findOne(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Post()
  createOne(
    @Body() createEntityDto: CreateGenreDto,
  ): Promise<DiagnosticModelEntity> {
    const model = plainToInstance(DiagnosticModelEntity, createEntityDto);

    return this.diagnosticModelsService.createOne(model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch(':id')
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateGenreDto,
  ): Promise<DiagnosticModelEntity> {
    const model = plainToInstance(DiagnosticModelEntity, updateEntityDto);

    return this.diagnosticModelsService.updateOne(conditions, model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteOne(@Param() conditions: IdDto): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelsService.deleteOne(conditions);
  }
}
