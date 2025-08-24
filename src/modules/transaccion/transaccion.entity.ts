import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transaccion', { schema: 'public' })
export class Transaccion {
  @Column({
    type: 'uuid',
    primary: true,
    name: 'tra_uuid',
    default: () => 'gen_random_uuid()',
  })
  traUuid: string;

  @Column({ type: 'numeric', precision: 15, scale: 4, name: 'tra_amount' })
  traAmount: number;

  @Column({ type: 'character varying', length: 3, name: 'tra_currency' })
  traCurrency: string;

  @Column({ type: 'character varying', length: 50, name: 'tra_metodo_pago' })
  traMetodoPago: string;

  @Column({ type: 'character varying', length: 20, name: 'tra_estado' })
  traEstado: string;

  @Column({ type: 'uuid', name: 'usu_uuid' })
  usuUuid: string;

  @Column({ type: 'uuid', name: 'com_uuid' })
  comUuid: string;

  @Column({ type: 'character varying', name: 'tra_qr' })
  traQr: string;

  @Column({ type: 'numeric', precision: 10, scale: 0, name: 'tra_numero' })
  traNumero: number;

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
}
