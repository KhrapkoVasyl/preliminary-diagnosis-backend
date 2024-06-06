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
import { CreateGenreDto, UpdateGenreDto, UploadModelVersionDto } from './dto';
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
    return this.diagnosticModelsService.findAllWithVersions();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelsService.findOneWithVersions(conditions);
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
  @Patch('versions/:id')
  @ApiParam({ name: 'id', description: 'Version id' })
  updateVersionStatus(
    @Param() conditions: IdDto,
    @Body() data: UpdateModelVersionStatusDto,
  ): Promise<DiagnosticModelVersionEntity> {
    return this.diagnosticModelsService.updateVersionStatus(conditions, data);
  }
}
