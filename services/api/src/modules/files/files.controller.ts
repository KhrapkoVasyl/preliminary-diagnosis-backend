import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileEntity } from './file.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto';
import { IdDto } from 'src/common/dto';
import { Role } from '../auth/decorators';
import { UserRoleEnum } from '../users/enums';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Role(UserRoleEnum.ADMIN)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileDto })
  createOne(@Body() dto: CreateFileDto): Promise<FileEntity> {
    return this.filesService.createOne(dto.file);
  }

  @Role(UserRoleEnum.ADMIN)
  @Get()
  async findAll(): Promise<FileEntity[]> {
    return this.filesService.findAll();
  }

  @Role(UserRoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param() conditions: IdDto): Promise<FileEntity> {
    return this.filesService.findOne(conditions);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteOne(@Param() conditions: IdDto) {
    return this.filesService.deleteOne(conditions);
  }
}
