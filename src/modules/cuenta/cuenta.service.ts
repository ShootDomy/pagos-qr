import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private cuentaRepository: Repository<Cuenta>,
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

      const cuenta = await this.cuentaRepository.save(nuevaCuenta);
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
}
