import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('cuenta', { schema: 'public' })
export class Cuenta {
  @Column({
    type: 'uuid',
    primary: true,
    name: 'cue_uuid',
    default: () => 'gen_random_uuid()',
  })
  cueUuid: string;

  @Column({
    type: 'numeric',
    name: 'cue_num_cuenta',
    precision: 10,
  })
  cueNumCuenta: number;

  @Column({
    type: 'numeric',
    name: 'cue_saldo',
    precision: 10,
    scale: 2,
  })
  cueSaldo: number;

  @Column({
    type: 'uuid',
    name: 'usu_uuid',
  })
  usuUuid: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  updatedAt: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  deletedAt: Date | null;

  @JoinColumn([{ name: 'usu_uuid', referencedColumnName: 'usuUuid' }])
  usuario: Usuario;
}
