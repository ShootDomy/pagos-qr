import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Transaccion } from '../transaccion/transaccion.entity';

@Entity('comerciante', { schema: 'public' })
export class Comerciante {
  @Column({
    type: 'uuid',
    primary: true,
    name: 'com_uuid',
    default: () => 'gen_random_uuid()',
  })
  comUuid: string;

  @Column({ type: 'character varying', length: 100, name: 'com_nombre' })
  comNombre: string;

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

  @OneToMany(() => Transaccion, (transaccion) => transaccion.comUuid)
  transacciones: Transaccion[];
}
