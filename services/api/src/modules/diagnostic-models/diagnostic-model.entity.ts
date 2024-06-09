import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from 'src/common/entities';
import { DiagnosticTypeEntity } from '../diagnostic-types/diagnostic-type.entity';
import { DiagnosticModelVersionEntity } from '../diagnostic-model-versions/diagnostic-model-version.entity';
import { DiagnosticModelStatus } from './enums';

@Entity({ name: 'diagnostic-models' })
export class DiagnosticModelEntity extends CommonEntity {
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

  @ApiProperty({
    type: 'MELANOMA_CUSTOM_MODEL_QUEUE',
    maxLength: 128,
    required: true,
    nullable: false,
    uniqueItems: true,
  })
  @Column({ length: 128, nullable: false, unique: true })
  queueName: string;

  @JoinColumn()
  @ApiProperty({
    type: () => DiagnosticTypeEntity,
    nullable: false,
    required: true,
  })
  @ManyToOne(() => DiagnosticTypeEntity, {
    onDelete: 'CASCADE',
    eager: false,
    nullable: false,
  })
  type: Partial<DiagnosticTypeEntity>;

  @ApiProperty({
    enum: DiagnosticModelStatus,
    default: DiagnosticModelStatus.ENABLED,
  })
  @Column({
    type: 'enum',
    enum: DiagnosticModelStatus,
    default: DiagnosticModelStatus.ENABLED,
  })
  public readonly status: DiagnosticModelStatus;

  @ApiHideProperty()
  @OneToMany(() => DiagnosticModelVersionEntity, ({ model }) => model, {
    nullable: true,
  })
  versions: DiagnosticModelVersionEntity[];
}
