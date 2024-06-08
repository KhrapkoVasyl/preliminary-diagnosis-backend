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
import { DiagnosticsService } from './diagnostics.service';
import { DiagnosticEntity } from './diagnostic.entity';
import { IdDto } from 'src/common/dto';
import { CreateDiagnosticDto, UpdateDiagnosticDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards';
import { Role, User } from '../auth/decorators';
import { UserRoleEnum } from '../users/enums';
import { UserEntity } from '../users/user.entity';

@ApiTags('diagnostics')
@Controller('diagnostics')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class DiagnosticsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  @Get()
  findAll(): Promise<DiagnosticEntity[]> {
    return this.diagnosticsService.findAll();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<DiagnosticEntity> {
    return this.diagnosticsService.findOne(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Post()
  @ApiBody({ type: CreateDiagnosticDto })
  @ApiConsumes('multipart/form-data')
  uploadModelVersion(
    @User() user: Partial<UserEntity>,
    @Body() data: CreateDiagnosticDto,
  ): Promise<DiagnosticEntity> {
    const { file, modelIds, ...diagnosticData } = data;

    return this.diagnosticsService.createDiagnostic(
      user,
      file,
      diagnosticData,
      modelIds,
    );
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch(':id')
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateDiagnosticDto,
  ): Promise<DiagnosticEntity> {
    const model = plainToInstance(DiagnosticEntity, updateEntityDto);

    return this.diagnosticsService.updateOne(conditions, model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteOne(@Param() conditions: IdDto): Promise<DiagnosticEntity> {
    return this.diagnosticsService.deleteOne(conditions);
  }
}
