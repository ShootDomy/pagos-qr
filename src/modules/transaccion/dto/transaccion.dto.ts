import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

@Expose()
export class generarCodigoQRDto {
  @IsNotEmpty({ message: 'El monto es requerido' })
  traAmount: number;

  @IsNotEmpty({ message: 'El UUID del comercio es requerido' })
  comUuid: string;
}

@Expose()
export class obtenerEstadoTransaccionDto {
  @IsOptional()
  traUuid: string;
}

@Expose()
export class procesarTransaccionDto {
  @IsNotEmpty({ message: 'El UUID de la transacción es requerido' })
  traUuid: string;

  @IsNotEmpty({ message: 'El UUID del usuario es requerido' })
  usuUuid: string;

  @IsNotEmpty({ message: 'El método de pago es requerido' })
  traMetodoPago: string;

  @IsNotEmpty({ message: 'El monto es requerido' })
  traAmount: number;
}

@Expose()
export class obtenerTransaccionesComercioDto {
  @IsNotEmpty({ message: 'El UUID del comercio es requerido' })
  comUuid: string;
}
