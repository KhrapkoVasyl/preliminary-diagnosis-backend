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
import { StudyTypesService } from './study-types.service';
import { StudyTypeEntity } from './study-type.entity';
import { IdDto } from 'src/common/dto';
import { CreateStudyTypeDto, UpdateStudyTypeDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../auth/guards';
import { Role } from '../auth/decorators';
import { UserRoleEnum } from '../users/enums';

@ApiTags('study-types')
@Controller('study-types')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class StudyTypesController {
  constructor(private readonly studyTypesService: StudyTypesService) {}

  @Get()
  findAll(): Promise<StudyTypeEntity[]> {
    return this.studyTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<StudyTypeEntity> {
    return this.studyTypesService.findOne(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Post()
  createOne(
    @Body() createEntityDto: CreateStudyTypeDto,
  ): Promise<StudyTypeEntity> {
    const model = plainToInstance(StudyTypeEntity, createEntityDto);

    return this.studyTypesService.createOne(model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Patch(':id')
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateStudyTypeDto,
  ): Promise<StudyTypeEntity> {
    const model = plainToInstance(StudyTypeEntity, updateEntityDto);

    return this.studyTypesService.updateOne(conditions, model);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteOne(@Param() conditions: IdDto): Promise<StudyTypeEntity> {
    return this.studyTypesService.deleteOne(conditions);
  }
}
