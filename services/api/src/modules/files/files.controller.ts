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
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto';
import { IdDto } from 'src/common/dto';

@ApiTags('files')
@Controller('files')
// @ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileDto })
  createOne(@Body() dto: CreateFileDto): Promise<FileEntity> {
    return this.filesService.createOne(dto.file);
  }

  @Get()
  async findAll(): Promise<FileEntity[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  async findOne(@Param() conditions: IdDto): Promise<FileEntity> {
    return this.filesService.findOne(conditions);
  }

  @Delete(':id')
  async deleteOne(@Param() conditions: IdDto) {
    return this.filesService.deleteOne(conditions);
  }
}
