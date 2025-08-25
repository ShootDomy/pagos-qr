import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class obtenerCuentaUsuarioResponse {
  @Expose({ name: 'cue_uuid' })
  cueUuid: string;

  @Expose({ name: 'cue_num_cuenta' })
  cueNumCuenta: number;

  @Expose({ name: 'cue_saldo' })
  cueSaldo: number;

  @Expose({ name: 'usu_uuid' })
  usuUuid: string;
}
