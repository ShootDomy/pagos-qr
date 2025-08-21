import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

@Expose()
export class registroUsuario {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  usuNombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  usuApellido: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail()
  usuCorreo: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @Min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  usuContrasena: string;
}

@Expose()
export class inicioSesionUsuario {
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail()
  usuCorreo: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @Min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  usuContrasena: string;
}
