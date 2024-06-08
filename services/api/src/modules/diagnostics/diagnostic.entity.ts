import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  VirtualColumn,
} from 'typeorm';
import { CommonEntity } from 'src/common/entities';
import { UserEntity } from '../users/user.entity';
import { FileEntity } from '../files/file.entity';
import { DiagnosticStatus } from './enums';
import { DiagnosticResultEntity } from '../diagnostic-results/diagnostic-result.entity';
import { getDiagnosticStatusQuery } from './diagnostics.helper';

@Entity({ name: 'diagnostics' })
export class DiagnosticEntity extends CommonEntity {
  @ApiProperty({ type: 'string', maxLength: 128 })
  @Column({ length: 128, nullable: false })
  name: string;

  @ApiProperty({
    type: 'string',
    maxLength: 500,
    required: false,
    nullable: true,
  })
  @Column({ length: 500, nullable: true })
  description: string;

  @ApiProperty({ type: () => UserEntity, required: true, nullable: false })
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    eager: false,
    nullable: false,
  })
  @JoinColumn()
  user: Partial<UserEntity>;

  @JoinColumn()
  @ApiProperty({
    type: () => FileEntity,
    required: true,
    nullable: false,
  })
  @OneToOne(() => FileEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  file: Partial<FileEntity>;

  @ApiProperty({
    enum: DiagnosticStatus,
  })
  @VirtualColumn({
    query: getDiagnosticStatusQuery,
  })
  status: DiagnosticStatus;

  @ApiHideProperty()
  @OneToMany(() => DiagnosticResultEntity, ({ diagnostic }) => diagnostic, {
    nullable: true,
  })
  results: DiagnosticResultEntity[];
}
