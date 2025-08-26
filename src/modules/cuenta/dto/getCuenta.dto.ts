import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class obtenerCuentaUsuarioResponse {
  @Expose({ name: 'cue_uuid' })
  cueUuid: string;

  @Expose({ name: 'cue_num_cuenta' })
  @Transform(({ value }) => (value ? Number(value) : 0))
  cueNumCuenta: number;

  @Expose({ name: 'cue_saldo' })
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  cueSaldo: number;

  @Expose({ name: 'usu_uuid' })
  usuUuid: string;
}
