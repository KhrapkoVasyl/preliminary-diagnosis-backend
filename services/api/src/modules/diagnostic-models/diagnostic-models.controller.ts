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
import {
  CreateDiagnosticModelDto,
  UpdateDiagnosticModelDto,
  UploadModelVersionDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards';
import { Role } from '../auth/decorators';
import { UserRoleEnum } from '../users/enums';
import { DiagnosticModelVersionEntity } from '../diagnostic-model-versions/diagnostic-model-version.entity';
import { UpdateModelVersionStatusDto } from './dto/update-model-version-status.dto';
import { UpdateModelStatusDto } from './dto/update-model-status.dto';

@ApiTags('diagnostic-models')
@Controller('diagnostic-models')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DiagnosticModelsController {
  constructor(
    private readonly diagnosticModelsService: DiagnosticModelsService,
  ) {}

  @Role(UserRoleEnum.ADMIN)
  @Get()
  findAll(): Promise<DiagnosticModelEntity[]> {
    return this.diagnosticModelsService.findAllWithVersions();
  }

  @Get('available')
  selectAvailableModels(): Promise<DiagnosticModelEntity[]> {
    return this.diagnosticModelsService.selectAvailableModels();
  }

  @Get(':id/available')
  @ApiParam({ name: 'id', description: 'Model id' })
  selectAvailableModelVersion(
    @Param() conditions: IdDto,
  ): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelsService.selectAvailableModelVersion(conditions);
  }

  @UseGuards(AccessTokenGuard)
  @Role(UserRoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelsService.findOneWithVersions(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Post()
  createOne(
    @Body() createEntityDto: CreateDiagnosticModelDto,
  ): Promise<DiagnosticModelEntity> {
    const model = plainToInstance(DiagnosticModelEntity, createEntityDto);

    return this.diagnosticModelsService.createOne(model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch(':id')
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateDiagnosticModelDto,
  ): Promise<DiagnosticModelEntity> {
    const model = plainToInstance(DiagnosticModelEntity, updateEntityDto);

    return this.diagnosticModelsService.updateOne(conditions, model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteOne(@Param() conditions: IdDto): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelsService.deleteOne(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Post(':id/versions')
  @ApiBody({ type: UploadModelVersionDto })
  @ApiConsumes('multipart/form-data')
  uploadModelVersion(
    @Param() conditions: IdDto,
    @Body() data: UploadModelVersionDto,
  ): Promise<DiagnosticModelEntity> {
    const { file, ...versionData } = data;

    return this.diagnosticModelsService.uploadModelVersion(
      conditions,
      file,
      versionData,
    );
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch(':id/status')
  @ApiParam({ name: 'id', description: 'Model id' })
  updateModelStatus(
    @Param() conditions: IdDto,
    @Body() data: UpdateModelStatusDto,
  ): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelsService.updateOne(conditions, data);
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch('versions/:id/status')
  @ApiParam({ name: 'id', description: 'Version id' })
  updateVersionStatus(
    @Param() conditions: IdDto,
    @Body() data: UpdateModelVersionStatusDto,
  ): Promise<DiagnosticModelVersionEntity> {
    return this.diagnosticModelsService.updateVersionStatus(conditions, data);
  }
}
