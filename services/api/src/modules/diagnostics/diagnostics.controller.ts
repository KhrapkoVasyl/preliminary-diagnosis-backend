import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DiagnosticsService } from './diagnostics.service';
import { DiagnosticEntity } from './diagnostic.entity';
import { IdDto } from 'src/common/dto';
import { CreateDiagnosticDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
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
  findAll(@User() user: Partial<UserEntity>): Promise<DiagnosticEntity[]> {
    return this.diagnosticsService.findAll({
      where: { user: { id: user.id } },
      loadEagerRelations: true,
    });
  }

  @Get(':id')
  findOne(@User() user: Partial<UserEntity>, @Param() conditions: IdDto) {
    return this.diagnosticsService.selectOneDetails({
      ...conditions,
      user: { id: user.id },
    });
  }

  @Role(UserRoleEnum.ADMIN)
  @Post()
  @ApiBody({ type: CreateDiagnosticDto })
  @ApiConsumes('multipart/form-data')
  uploadModelVersion(
    @User() user: Partial<UserEntity>,
    @Body() data: CreateDiagnosticDto,
  ) {
    const { file, modelIds, ...diagnosticData } = data;

    return this.diagnosticsService.createDiagnostic(
      user,
      file,
      diagnosticData,
      modelIds,
    );
  }
}
