import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comerciante } from './comerciante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComercianteService {
  constructor(
    @InjectRepository(Comerciante)
    private readonly _comercianteRepository: Repository<Comerciante>,
  ) {}

  async obtenerComerciantes() {
    try {
      const comerciantes = await this._comercianteRepository
        .createQueryBuilder('com')
        .select(['com.comUuid', 'com.comNombre'])
        .getMany();
      return comerciantes;
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al obtener los comerciantes',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async obtenerComerciantesUuid(comUuid: string) {
    try {
      const comerciante = await this._comercianteRepository.query(`
        SELECT com_uuid, com_nombre
        FROM comerciante
        WHERE com_uuid = '${comUuid}'
          AND deleted_at IS NULL
      `);
      return comerciante;
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al obtener el comerciante',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
