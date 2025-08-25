import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
import { Repository } from 'typeorm';
import { utilResponse } from '../../utils/utilResponse';
import { obtenerCuentaUsuarioDto } from './dto/cuenta.dto';
import { plainToInstance } from 'class-transformer';
import { obtenerCuentaUsuarioResponse } from './dto/getCuenta.dto';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private _cuentaRepository: Repository<Cuenta>,
  ) {}

  async generarCuenta(usuUuid: string) {
    try {
      const numCuenta = Math.floor(1000000000 + Math.random() * 9000000000);

      const saldo = parseFloat((Math.random() * 150).toFixed(2));

      const nuevaCuenta: Partial<Cuenta> = {
        usuUuid: usuUuid,
        cueNumCuenta: numCuenta,
        cueSaldo: saldo,
      };

      const cuenta = await this._cuentaRepository.save(nuevaCuenta);
      return cuenta;
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al generar la cuenta',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validarSaldoUsuario(usuUuid: string) {
    try {
      const saldo = await this._cuentaRepository.query(`
        SELECT cue_uuid, cue_saldo
        FROM cuenta 
        WHERE usu_uuid = '${usuUuid}'
          AND deleted_at ISNULL  
      `);

      return saldo;
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al validar el saldo del usuario',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async actualizarSaldoUsuario(cueUuid: string, saldo: number) {
    try {
      const cuenta: Partial<Cuenta> = {
        cueUuid: cueUuid,
        cueSaldo: saldo,
      };

      await this._cuentaRepository.update(cueUuid, cuenta);

      return new utilResponse().setSuccess();
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al actualizar el saldo del usuario',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerCuentaXUsuario(data: obtenerCuentaUsuarioDto) {
    try {
      const saldo = await this._cuentaRepository.query(`
        SELECT cue_uuid, cue_num_cuenta, cue_saldo, usu_uuid
        FROM cuenta 
        WHERE usu_uuid = '${data.usuUuid}'
          AND deleted_at ISNULL  
      `);

      return plainToInstance(obtenerCuentaUsuarioResponse, saldo[0]);
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al validar el saldo del usuario',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
