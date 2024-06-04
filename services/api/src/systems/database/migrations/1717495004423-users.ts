import { UserRoleEnum } from 'src/modules/users/enums';
import { UserEntity } from 'src/modules/users/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const data: Partial<UserEntity>[] = [
  {
    id: 'e5333601-bfee-4af8-bc01-ad1370087c32',
    role: UserRoleEnum.ADMIN,
    email: 'admin@gmail.com',
    password: '$2b$10$GNktER7wm46jBVwsOCjdc.9fh08oe8tMr.XlunJBOVUXko2CI7CRG', // Pass1234
    name: 'Steve Smith',
  },
];

export class Users1717495004423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.synchronize(); // TODO: delete after init migration
    await queryRunner.connection.getRepository(UserEntity).save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection
      .getRepository(UserEntity)
      .delete(data.map(({ id }) => id));
  }
}
