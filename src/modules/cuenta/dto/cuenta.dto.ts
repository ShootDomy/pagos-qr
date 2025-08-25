import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Expose()
export class obtenerCuentaUsuarioDto {
  @IsNotEmpty({ message: 'El UUID del usuario es requerido' })
  usuUuid: string;
}
