import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from 'src/common/entities';
import { UserEntity } from '../users/user.entity';
import { FileEntity } from '../files/file.entity';
import { DiagnosticStatus } from './enums';

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
    // TODO: change to virtual fields
    enum: DiagnosticStatus,
    default: DiagnosticStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: DiagnosticStatus,
    default: DiagnosticStatus.PENDING,
  })
  readonly status: DiagnosticStatus;
}
