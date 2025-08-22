import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { inicioSesionUsuario, registroUsuario } from './dto/usuario.dto';
import { IUsuarioPayload } from './interface/usuario.interface';
import { CuentaService } from '../cuenta/cuenta.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly _usuarioRepository: Repository<Usuario>,
    private readonly _jwtService: JwtService,
    private readonly _cuentaService: CuentaService,
  ) {}

  async validarCorreo(usuCorreo: string) {
    try {
      const correoValido = await this._usuarioRepository.query(`
        SELECT usu_uuid, usu_nombre, usu_apellido, usu_correo, usu_contrasena
        FROM usuario 
        WHERE usu_correo = '${usuCorreo}'
          AND usu_activo IS TRUE
      `);

      return correoValido;
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al validar el correo',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async registrarUsuario(usuario: registroUsuario) {
    try {
      /**
       * * Validar otros campos
       */

      // Validar correo
      const validarCorreo = await this.validarCorreo(usuario.usuCorreo);

      if (validarCorreo.length > 0) {
        throw new HttpException(
          'El correo ya esta registrado',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar contraseña
      if (usuario.usuContrasena.length < 8) {
        throw new HttpException(
          'La contraseña debe tener al menos 8 caracteres',
          HttpStatus.BAD_REQUEST,
        );
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const nuevaContra = await bcrypt.hash(usuario.usuContrasena, salt);

      const nuevoUsuario: Partial<Usuario> = {
        usuNombre: usuario.usuNombre,
        usuApellido: usuario.usuApellido,
        usuCorreo: usuario.usuCorreo,
        usuContrasena: nuevaContra,
        usuActivo: true,
      };

      const user = await this._usuarioRepository.save(nuevoUsuario);

      // Generar cuenta con saldo aleatorio
      await this._cuentaService.generarCuenta(user.usuUuid);

      return user;
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al registrar el usuario',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async inicioSesionUsuario(usuario: inicioSesionUsuario) {
    try {
      const validarCorreo = await this.validarCorreo(usuario.usuCorreo);

      if (validarCorreo.length == 0) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      const hashedPassword = validarCorreo[0].usu_contrasena;
      const validarContrasena = await bcrypt.compare(
        usuario.usuContrasena,
        hashedPassword,
      );

      if (!validarContrasena) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      const tokenPayload: IUsuarioPayload = {
        usuUuid: validarCorreo[0].usu_uuid,
        usuNombre: validarCorreo[0].usu_nombre,
        usuApellido: validarCorreo[0].usu_apellido,
        usuCorreo: validarCorreo[0].usu_correo,
      };

      return {
        token: this._jwtService.sign(tokenPayload),
      };
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al iniciar sesión',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
