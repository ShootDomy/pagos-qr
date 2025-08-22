import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class obtenerEstadoTransac {
  @Expose({ name: 'tra_uuid' })
  traUuid: string;

  @Expose({ name: 'tra_estado' })
  traEstado: string;
}
