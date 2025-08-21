import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuario', { schema: 'public' })
export class Usuario {
  @Column({
    type: 'uuid',
    primary: true,
    name: 'usu_uuid',
    default: () => 'gen_random_uuid()',
  })
  usuUuid: string;

  @Column('character varying', { name: 'usu_nombre' })
  usuNombre: string;

  @Column('character varying', {
    name: 'usu_apellido',
  })
  usuApellido: string;

  @Column('character varying', { name: 'usu_correo', unique: true })
  usuCorreo: string;

  @Column('character varying', { name: 'usu_contrasena' })
  usuContrasena: string;

  @Column('boolean', { name: 'usu_activo', default: () => 'true' })
  usuActivo: boolean;

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
