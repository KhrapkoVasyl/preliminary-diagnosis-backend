import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { diagnosticModelsServiceErrorMessages } from './diagnostic-models.constants';
import { DiagnosticModelEntity } from './diagnostic-model.entity';
import { IMultipartFile } from 'src/systems/storage/interfaces';
import { DiagnosticModelVersionEntity } from '../diagnostic-model-versions/diagnostic-model-version.entity';
import { FilesService } from '../files/files.service';
import { join } from 'node:path';
import { MODELS_DIRECTORY } from 'src/systems/storage/storage.constants';
import { DiagnosticModelVersionsService } from '../diagnostic-model-versions/diagnostic-model-versions.service';
import { DiagnosticModelStatus } from './enums';
import { DiagnosticModelVersionStatus } from '../diagnostic-model-versions/enums';

@Injectable()
export class DiagnosticModelsService extends BaseService<DiagnosticModelEntity> {
  constructor(
    @InjectRepository(DiagnosticModelEntity)
    private readonly diagnosticModelEntityRepository: Repository<DiagnosticModelEntity>,
    private readonly filesService: FilesService,
    private readonly diagnosticModelVersionsService: DiagnosticModelVersionsService,
  ) {
    super(
      diagnosticModelEntityRepository,
      diagnosticModelsServiceErrorMessages,
    );
  }

  async findOneWithVersions(
    conditions: FindOptionsWhere<DiagnosticModelEntity>,
    options?: FindOneOptions<DiagnosticModelEntity>,
    transactionManager?: EntityManager,
  ): Promise<DiagnosticModelEntity> {
    return this.findOne(
      conditions,
      {
        ...options,
        loadEagerRelations: false,
        relations: { versions: { file: true } },
        order: { versions: { version: 'DESC' } },
      },
      transactionManager,
    );
  }

  async findAllWithVersions(
    options?: FindManyOptions<DiagnosticModelEntity>,
    transactionManager?: EntityManager,
  ): Promise<DiagnosticModelEntity[]> {
    return this.findAll(
      {
        ...options,
        loadEagerRelations: false,
        relations: { versions: { file: true } },
        order: { versions: { version: 'DESC' } },
      },
      transactionManager,
    );
  }

  async selectAvailableModels(
    options?: FindManyOptions<DiagnosticModelEntity>,
    transactionManager?: EntityManager,
  ): Promise<DiagnosticModelEntity[]> {
    const models = await this.findAll(
      {
        ...options,
        where: {
          status: DiagnosticModelStatus.ENABLED,
          versions: {
            status: DiagnosticModelVersionStatus.ENABLED,
          },
        },
        relations: { versions: { file: true } },
        order: {
          versions: {
            version: 'DESC',
          },
        },
      },
      transactionManager,
    );

    const filteredModels = models.filter((model) => {
      if (model.versions && model.versions.length > 0) {
        model.versions = [model.versions[0]];
        return true;
      }
      return false;
    });

    return filteredModels;
  }

  async selectAvailableModelVersion(
    conditions: FindOptionsWhere<DiagnosticModelEntity>,
    options?: FindOneOptions<DiagnosticModelEntity>,
    transactionManager?: EntityManager,
  ): Promise<DiagnosticModelEntity> {
    const model = await this.findOneWithVersions(
      {
        ...conditions,
        status: DiagnosticModelStatus.ENABLED,
        versions: { status: DiagnosticModelVersionStatus.ENABLED },
      },
      options,
      transactionManager,
    );

    model.versions = [model.versions[0]];
    return model;
  }

  async uploadModelVersion(
    conditions: FindOptionsWhere<DiagnosticModelEntity>,
    file: IMultipartFile,
    versionData: Partial<DiagnosticModelVersionEntity>,
  ): Promise<DiagnosticModelEntity> {
    return this.diagnosticModelEntityRepository.manager.transaction(
      async (transaction) => {
        const { id, versions = [] } = await this.findOneWithVersions(
          conditions,
          undefined,
          transaction,
        );

        const filePath = this.getPathToModelVersionFile(id);
        const newVersionFile = await this.filesService.createOne(
          file,
          {},
          filePath,
          transaction,
        );

        const lastVersion = versions?.[0]?.version ?? 0;

        await this.diagnosticModelVersionsService.createOne(
          {
            ...versionData,
            version: lastVersion + 1,
            model: { id },
            file: { id: newVersionFile.id },
          },
          transaction,
        );

        return this.findOneWithVersions({ id }, undefined, transaction);
      },
    );
  }

  async updateVersionStatus(
    conditions: FindOptionsWhere<DiagnosticModelVersionEntity>,
    versionData: Partial<DiagnosticModelVersionEntity>,
  ): Promise<DiagnosticModelVersionEntity> {
    return this.diagnosticModelVersionsService.updateOne(
      conditions,
      versionData,
    );
  }

  getPathToModelVersionFile(modelId: string): string {
    return join(MODELS_DIRECTORY, modelId);
  }
}
