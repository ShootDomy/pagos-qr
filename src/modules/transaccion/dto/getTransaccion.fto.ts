import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class obtenerEstadoTransac {
  @Expose({ name: 'tra_uuid' })
  traUuid: string;

  @Expose({ name: 'tra_estado' })
  traEstado: string;

  @Expose({ name: 'tra_numero' })
  traNumero: number;
}

@Exclude()
export class obtenerTransaccionesComercioResponse {
  @Expose({ name: 'usu_uuid' })
  usuUuid: string;

  @Expose({ name: 'cliente' })
  cliente: string;

  @Expose({ name: 'tra_uuid' })
  traUuid: string;

  @Expose({ name: 'tra_amount' })
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  traAmount: number;

  @Expose({ name: 'tra_currency' })
  traCurrency: string;

  @Expose({ name: 'tra_metodo_pago' })
  traMetodoPago: string;

  @Expose({ name: 'tra_estado' })
  traEstado: string;

  @Expose({ name: 'fecha_creacion' })
  fechaCreacion: string;

  @Expose({ name: 'tra_qr' })
  traQr: string;

  @Expose({ name: 'tra_numero' })
  traNumero: number;
}
