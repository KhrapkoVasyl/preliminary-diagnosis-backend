import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';
import { CommonEntity } from 'src/common/entities';

@Entity({ name: 'diagnostic-types' })
export class DiagnosticTypeEntity extends CommonEntity {
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
}
