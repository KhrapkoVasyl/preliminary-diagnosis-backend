import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from 'src/common/entities';
import { FileEntity } from '../files/file.entity';
import { DiagnosticResultStatus } from './enums';
import { DiagnosticEntity } from '../diagnostics/diagnostic.entity';
import { DiagnosticModelVersionEntity } from '../diagnostic-model-versions/diagnostic-model-version.entity';
import { Transform } from 'class-transformer';

@Entity({ name: 'diagnostic-results' })
export class DiagnosticResultEntity extends CommonEntity {
  @ApiProperty({
    type: () => DiagnosticEntity,
    required: true,
    nullable: false,
  })
  @ManyToOne(() => DiagnosticEntity, {
    onDelete: 'CASCADE',
    eager: false,
    nullable: false,
  })
  @JoinColumn()
  diagnostic: Partial<DiagnosticEntity>;

  @JoinColumn()
  @ApiProperty({
    type: () => FileEntity,
    required: true,
    nullable: false,
  })
  @ManyToOne(() => DiagnosticModelVersionEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: false,
  })
  modelVersion: Partial<DiagnosticModelVersionEntity>;

  @ApiProperty({
    enum: DiagnosticResultStatus,
    default: DiagnosticResultStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: DiagnosticResultStatus,
    default: DiagnosticResultStatus.PENDING,
  })
  status: DiagnosticResultStatus;

  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({ type: Number, required: false, example: 23, nullable: true })
  @Column({ type: 'numeric', scale: 2, precision: 5, nullable: true })
  deseasProbability: number;

  @ApiProperty({
    type: 'string',
    maxLength: 500,
    required: false,
    nullable: true,
  })
  @Column({ length: 500, nullable: true })
  resultDescription: string;
}
