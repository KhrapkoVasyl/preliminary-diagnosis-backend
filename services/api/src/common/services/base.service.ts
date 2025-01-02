import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  Repository,
  EntityManager,
} from 'typeorm';
import { CommonEntity } from '../entities';
import { TServiceErrorMessages } from '../types';

export abstract class BaseService<T extends CommonEntity> {
  constructor(
    protected entityRepository: Repository<T>,
    protected serviceErrorMessages: TServiceErrorMessages,
  ) {}

  async findAll(
    options: FindManyOptions<T> = { loadEagerRelations: true },
    transactionManager?: EntityManager,
  ): Promise<T[]> {
    const repository = transactionManager
      ? transactionManager.getRepository<T>(this.entityRepository.target)
      : this.entityRepository;

    return repository.find(options).catch(() => {
      throw new NotFoundException(this.serviceErrorMessages.entitiesNotFound);
    });
  }

  async findOne(
    conditions: FindOptionsWhere<T>,
    options: FindOneOptions<T> = { loadEagerRelations: true },
    transactionManager?: EntityManager,
  ): Promise<T> {
    const repository = transactionManager
      ? transactionManager.getRepository<T>(this.entityRepository.target)
      : this.entityRepository;

    return repository
      .findOneOrFail({
        ...options,
        where: conditions,
      })
      .catch(() => {
        throw new NotFoundException(this.serviceErrorMessages.entityNotFound);
      });
  }

  async createOne(
    entity: Partial<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    const repository = transactionManager
      ? transactionManager.getRepository<T>(this.entityRepository.target)
      : this.entityRepository;

    const entityToCreate = repository.create(entity as T);
    const { id } = await repository.save(entityToCreate).catch(() => {
      throw new BadRequestException(this.serviceErrorMessages.invalidData);
    });
    return this.findOne(
      { id } as FindOptionsWhere<T>,
      { loadEagerRelations: true },
      transactionManager,
    );
  }

  async updateOne(
    conditions: FindOptionsWhere<T>,
    entity: Partial<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    const repository = transactionManager
      ? transactionManager.getRepository<T>(this.entityRepository.target)
      : this.entityRepository;

    const entityToUpdate = await this.findOne(
      conditions,
      { loadEagerRelations: false },
      transactionManager,
    );
    const updatedEntity = repository.merge(entityToUpdate, entity as T);
    const { id } = await repository.save(updatedEntity).catch(() => {
      throw new BadRequestException(this.serviceErrorMessages.invalidData);
    });

    return this.findOne(
      { id } as FindOptionsWhere<T>,
      { loadEagerRelations: true },
      transactionManager,
    );
  }

  async deleteOne(
    conditions: FindOptionsWhere<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    const repository = transactionManager
      ? transactionManager.getRepository<T>(this.entityRepository.target)
      : this.entityRepository;

    const entity = await this.findOne(
      conditions,
      {
        loadEagerRelations: false,
      },
      transactionManager,
    );

    return repository.remove(entity).catch(() => {
      throw new NotFoundException(this.serviceErrorMessages.entityNotFound);
    });
  }
}
