import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import {
  EntityManager,
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
      },
      transactionManager,
    ).then((data) => {
      if (data?.versions) {
        data.versions.sort((a, b) => b.version - a.version);
      }

      return data;
    });
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

  getPathToModelVersionFile(modelId: string): string {
    return join(MODELS_DIRECTORY, modelId);
  }
}
