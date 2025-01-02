import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  Repository,
  EntityManager,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { StorageService } from 'src/systems/storage/storage.service';
import { IMultipartFile } from 'src/systems/storage/interfaces';
import { UNCATEGORIZED_ROOT_DIRECTORY } from 'src/systems/storage/storage.constants';
import { filesServiceErrorMessages } from './files.constants';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileEntityRepository: Repository<FileEntity>,
    private readonly storageService: StorageService,
  ) {}

  async createOne(
    file: IMultipartFile,
    data?: Partial<FileEntity>,
    pathToFile = UNCATEGORIZED_ROOT_DIRECTORY,
    transactionManager?: EntityManager,
  ) {
    const repository = transactionManager
      ? transactionManager.getRepository<FileEntity>(
          this.fileEntityRepository.target,
        )
      : this.fileEntityRepository;

    const uploadedFileEntity = await this.storageService.createOne(
      file,
      pathToFile,
    );
    const entityLike = repository.create(uploadedFileEntity);
    const entityToCreate = repository.merge(entityLike, data);
    const { id } = await repository.save(entityToCreate).catch(() => {
      throw new BadRequestException(filesServiceErrorMessages.invalidData);
    });
    return this.findOne(
      { id },
      { loadEagerRelations: true },
      transactionManager,
    );
  }

  async findOne(
    conditions: FindOptionsWhere<FileEntity>,
    options: FindOneOptions<FileEntity> = { loadEagerRelations: true },
    transactionManager?: EntityManager,
  ): Promise<FileEntity> {
    const repository = transactionManager
      ? transactionManager.getRepository<FileEntity>(
          this.fileEntityRepository.target,
        )
      : this.fileEntityRepository;

    return repository
      .findOneOrFail({
        ...options,
        where: conditions,
      })
      .catch(() => {
        throw new NotFoundException(filesServiceErrorMessages.entityNotFound);
      });
  }

  async findAll(
    options: FindManyOptions<FileEntity> = { loadEagerRelations: true },
  ): Promise<FileEntity[]> {
    return this.fileEntityRepository.find(options).catch(() => {
      throw new NotFoundException(filesServiceErrorMessages.entitiesNotFound);
    });
  }

  async deleteOne(
    conditions: FindOptionsWhere<FileEntity>,
  ): Promise<FileEntity> {
    const entity = await this.findOne(conditions);
    await this.storageService.deleteOne(entity.pathInStorage);
    return this.fileEntityRepository.remove(entity).catch(() => {
      throw new NotFoundException(filesServiceErrorMessages.entityNotFound);
    });
  }
}
