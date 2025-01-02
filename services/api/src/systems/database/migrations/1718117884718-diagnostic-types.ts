import { DiagnosticTypeEntity } from 'src/modules/diagnostic-types/diagnostic-type.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const data: Partial<DiagnosticTypeEntity>[] = [
  {
    id: '974a15aa-37af-43f1-bae9-b03c8bdf754b',
    name: 'Діагностування пневмонії',
  },
  {
    id: 'c85103e1-1763-43b1-b355-b5d930965b93',
    name: 'Діагностування псоріазу',
  },
  {
    id: '1ae1b71d-e508-459d-a147-03a9a6ba5071',
    name: 'Діагностування фурункульозу',
  },
  {
    id: '36da8e9f-20e8-47d7-92b5-ec1ae864a8c8',
    name: 'Діагностування екземи',
  },
  {
    id: '2211c797-f489-49e2-9745-69fbdb911192',
    name: 'Діагностування хвороби Шамберга',
  },
];

export class Users1718117884718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('\n\nRUNNING MIGRATION\n\n');

    await queryRunner.connection.synchronize();
    await queryRunner.connection.getRepository(DiagnosticTypeEntity).save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .getRepository(DiagnosticTypeEntity)
      .delete(data.map(({ id }) => id));
  }
}
