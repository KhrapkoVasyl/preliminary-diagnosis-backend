import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository, EntityManager, FindOptionsWhere } from 'typeorm';
import { diagnosticsServiceErrorMessages } from './diagnostics.constants';
import { DiagnosticEntity } from './diagnostic.entity';
import { UserEntity } from '../users/user.entity';
import { IMultipartFile } from 'src/systems/storage/interfaces';
import { join } from 'path';
import { DIAGNOSTIC_IMAGE_DIRECTORY } from 'src/systems/storage/storage.constants';
import { randomUUID } from 'crypto';
import { FilesService } from '../files/files.service';
import { DiagnosticResultsService } from '../diagnostic-results/diagnostic-results.service';
import { DiagnosticModelsService } from '../diagnostic-models/diagnostic-models.service';
import { ErrorMessagesEnum } from 'src/common/enums';

@Injectable()
export class DiagnosticsService extends BaseService<DiagnosticEntity> {
  constructor(
    @InjectRepository(DiagnosticEntity)
    private readonly diagnosticEntityRepository: Repository<DiagnosticEntity>,
    private readonly filesService: FilesService,
    private readonly diagnosticResultsService: DiagnosticResultsService,
    private readonly diagnosticModelsService: DiagnosticModelsService,
  ) {
    super(diagnosticEntityRepository, diagnosticsServiceErrorMessages);
  }

  async selectOneDetails(
    conditions: FindOptionsWhere<DiagnosticEntity>,
    transactionManager?: EntityManager,
  ) {
    const diagnostic = await this.findOne(
      conditions,
      {
        loadEagerRelations: false,
        relations: {
          image: true,
          results: { modelVersion: { model: { type: true } } },
        },
      },
      transactionManager,
    );

    return this.transformDiagnosticToDetailsFormat(diagnostic);
  }

  private transformDiagnosticToDetailsFormat(
    diagnostic: Partial<DiagnosticEntity>,
  ) {
    const { results, ...diagnosticData } = diagnostic;

    const types = {};
    for (const result of results) {
      const { modelVersion, ...resultData } = result;
      const { model, ...versionData } = modelVersion;
      const { type, ...modelData } = model;

      if (!types[type.id]) {
        types[type.id] = {
          ...type,
          models: {},
        };
      }
      const typeInCollection = types[type.id];

      if (!typeInCollection.models[model.id]) {
        types[type.id].models[model.id] = {
          ...modelData,
          versions: {},
        };
      }

      const modelInCollection = typeInCollection.models[model.id];
      if (!modelInCollection.versions[modelVersion.id]) {
        types[type.id].models[model.id].versions[modelVersion.id] = {
          ...versionData,
          results: {},
        };
      }
      const versionInCollection = modelInCollection.versions[modelVersion.id];

      versionInCollection.results[result.id] = resultData;
    }

    return { ...diagnosticData, types };
  }

  async createDiagnostic(
    user: Partial<UserEntity>,
    file: IMultipartFile,
    entity: Partial<DiagnosticEntity>,
    modelIds: string[],
  ) {
    return this.diagnosticEntityRepository.manager.transaction(
      async (transaction) => {
        const diagnosticId = randomUUID();
        const actualName = entity?.name ?? this.generateDefaultNameByDate();

        const filePath = this.getPathToDiagnosticImageFile(
          user.id,
          diagnosticId,
        );
        const image = await this.filesService.createOne(
          file,
          {},
          filePath,
          transaction,
        );

        await this.createOne(
          {
            ...entity,
            name: actualName,
            id: diagnosticId,
            image: { id: image.id },
            user: { id: user.id },
          },
          transaction,
        );

        await this.uploadDiagnosticByModels(
          diagnosticId,
          modelIds,
          transaction,
        );

        return this.selectOneDetails({ id: diagnosticId }, transaction);
      },
    );
  }

  async uploadDiagnosticByModels(
    diagnosticId: string,
    modelIds: string[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    const uniqueModelIds = new Set(modelIds); // remove duplicate values
    let uploadedModels = 0;

    for (const modelId of uniqueModelIds) {
      const model = await this.diagnosticModelsService
        .selectAvailableModelVersion({ id: modelId }, null, transactionManager)
        .catch(() => null);

      const availableVersion = model?.versions?.[0];

      if (!availableVersion) {
        continue;
      }
      await this.diagnosticResultsService.createOne(
        {
          diagnostic: { id: diagnosticId },
          modelVersion: { id: availableVersion.id },
        },
        transactionManager,
      );
      uploadedModels++;
    }

    if (uploadedModels === 0) {
      throw new BadRequestException(
        ErrorMessagesEnum.NO_VALID_MODELS_FOR_DIAGNOSIS_SPECIFIED,
      );
    }
  }

  getPathToDiagnosticImageFile(userId: string, diagnosticId: string): string {
    return join(DIAGNOSTIC_IMAGE_DIRECTORY, userId, diagnosticId);
  }

  generateDefaultNameByDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `diagnostic_${year}${month}${day}_${hours}${minutes}${seconds}`;
  }
}
