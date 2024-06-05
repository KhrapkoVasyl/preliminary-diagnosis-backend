import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from 'src/common/entities';
import { DiagnosticModelEntity } from '../diagnostic-models/diagnostic-model.entity';
import { FileEntity } from '../files/file.entity';

@Entity({ name: 'diagnostic-model-versions' })
export class DiagnosticModelVersionEntity extends CommonEntity {
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

  @ApiProperty({ type: 'integer', required: true, example: 1 })
  @Column({ type: 'integer', nullable: false })
  public version: number;

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
  public readonly file: Partial<FileEntity>;

  @JoinColumn()
  @ApiProperty({
    type: () => DiagnosticModelEntity,
    nullable: false,
    required: true,
  })
  @ManyToOne(() => DiagnosticModelEntity, {
    onDelete: 'CASCADE',
    eager: false,
    nullable: false,
  })
  model: Partial<DiagnosticModelEntity>;
}
