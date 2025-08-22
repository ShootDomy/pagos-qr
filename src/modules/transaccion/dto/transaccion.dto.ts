import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Expose()
export class generarCodigoQR {
  @IsNotEmpty({ message: 'El monto es requerido' })
  traAmount: number;

  @IsNotEmpty({ message: 'El UUID del comercio es requerido' })
  comUuid: string;
}

@Expose()
export class obtenerEstadoTransaccion {
  @IsNotEmpty({ message: 'El UUID de la transacción es requerido' })
  traUuid: string;
}
