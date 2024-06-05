import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from 'src/common/entities';
import { DiagnosticTypeEntity } from '../diagnostic-types/diagnostic-type.entity';

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
}
