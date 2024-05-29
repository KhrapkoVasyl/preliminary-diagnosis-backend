import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CommonEntity } from 'src/common/entities';
import * as bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS } from 'src/common/constants';
import { SexAtBirthEnum, UserRoleEnum } from './enums';

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @ApiProperty({ type: 'string', maxLength: 128 })
  @Column({ length: 128 })
  name: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ length: 256 })
  password: string;

  @ApiProperty({ type: 'string', maxLength: 256, uniqueItems: true })
  @Column({ length: 256, unique: true })
  email: string;

  @ApiProperty({ enum: UserRoleEnum, default: UserRoleEnum.PATIENT })
  @Column({
    enum: UserRoleEnum,
    default: UserRoleEnum.PATIENT,
    nullable: false,
  })
  role: UserRoleEnum;

  @ApiProperty({ type: 'integer', nullable: true })
  @Column({ type: 'integer', nullable: true })
  public age: number;

  @ApiProperty({
    enum: SexAtBirthEnum,
    nullable: true,
  })
  @Column({
    type: 'enum',
    enum: SexAtBirthEnum,
    nullable: true,
  })
  public readonly sexAtBirth: SexAtBirthEnum;

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword() {
    if (this.password)
      this.password = await bcrypt.hash(this.password, PASSWORD_SALT_ROUNDS);
  }
}
