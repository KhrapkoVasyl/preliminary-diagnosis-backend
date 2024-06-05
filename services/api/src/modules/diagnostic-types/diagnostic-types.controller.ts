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
import { DiagnosticTypesService } from './diagnostic-types.service';
import { DiagnosticTypeEntity } from './diagnostic-type.entity';
import { IdDto } from 'src/common/dto';
import { CreateDiagnosticTypeDto, UpdateDiagnosticTypeDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards';
import { Role } from '../auth/decorators';
import { UserRoleEnum } from '../users/enums';

@ApiTags('diagnostic-types')
@Controller('diagnostic-types')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DiagnosticTypesController {
  constructor(
    private readonly diagnosticTypesService: DiagnosticTypesService,
  ) {}

  @Get()
  findAll(): Promise<DiagnosticTypeEntity[]> {
    return this.diagnosticTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<DiagnosticTypeEntity> {
    return this.diagnosticTypesService.findOne(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Post()
  createOne(
    @Body() createEntityDto: CreateDiagnosticTypeDto,
  ): Promise<DiagnosticTypeEntity> {
    const model = plainToInstance(DiagnosticTypeEntity, createEntityDto);

    return this.diagnosticTypesService.createOne(model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch(':id')
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateDiagnosticTypeDto,
  ): Promise<DiagnosticTypeEntity> {
    const model = plainToInstance(DiagnosticTypeEntity, updateEntityDto);

    return this.diagnosticTypesService.updateOne(conditions, model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteOne(@Param() conditions: IdDto): Promise<DiagnosticTypeEntity> {
    return this.diagnosticTypesService.deleteOne(conditions);
  }
}
