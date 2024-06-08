import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository } from 'typeorm';
import { diagnosticsServiceErrorMessages } from './diagnostics.constants';
import { DiagnosticEntity } from './diagnostic.entity';

@Injectable()
export class DiagnosticsService extends BaseService<DiagnosticEntity> {
  constructor(
    @InjectRepository(DiagnosticEntity)
    private readonly diagnosticEntityRepository: Repository<DiagnosticEntity>,
  ) {
    super(diagnosticEntityRepository, diagnosticsServiceErrorMessages);
  }

  async selectOneDetails(
    conditions: FindOptionsWhere<DiagnosticEntity>,
    transactionManager?: EntityManager,
  ): Promise<DiagnosticEntity> {
    return this.findOne(conditions, {}, transactionManager);
  }

  async createDiagnostic(
    user: Partial<UserEntity>,
    file: IMultipartFile,
    entity: Partial<DiagnosticEntity>,
    modelIds: string[],
  ): Promise<DiagnosticEntity> {
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

        const createdDiagnostic = await this.createOne(
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

        return createdDiagnostic;
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
