import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Transaccion } from './transaccion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generarCodigoQRDto,
  obtenerEstadoTransaccionDto,
  obtenerTransaccionesComercioDto,
  procesarTransaccionDto,
} from './dto/transaccion.dto';
import { ITransaccionPayloadQr } from './interface/transaccion.interface';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { plainToInstance } from 'class-transformer';
import {
  obtenerEstadoTransac,
  obtenerTransaccionesComercioResponse,
} from './dto/getTransaccion.fto';
import { CuentaService } from '../cuenta/cuenta.service';
import { utilResponse } from '../../utils/utilResponse';
import { FirebaseService } from '../firebase/firebase.service';
import { enviarNotificacionDto } from '../firebase/dto/firebase.dto';
// import * as crypto from 'crypto';

@Injectable()
export class TransaccionService {
  private readonly QR_SECRET: string;
  constructor(
    @InjectRepository(Transaccion)
    private _transaccionRepository: Repository<Transaccion>,
    private readonly _cuentaService: CuentaService,
    private readonly _firebaseService: FirebaseService,
  ) {
    this.QR_SECRET = process.env.QR_SIGNATURE_SECRET!;
  }

  async generarQr(data: generarCodigoQRDto) {
    try {
      if (data.traAmount <= 0) {
        throw new HttpException(
          'El monto debe ser mayor que cero',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payloadQr: ITransaccionPayloadQr = {
        traUuid: uuidv4(),
        traAmount: Number(data.traAmount.toFixed(2)),
        traCurrency: 'USD',
        comUuid: data.comUuid,
      };

      /**
       * * Generar código QR
       */
      const jsonString = JSON.stringify(payloadQr);

      const qrOptions: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.9,
        margin: 2,
        width: 300,
      };

      // Generar QR en base64
      const qrBase64 = await QRCode.toDataURL(jsonString, qrOptions);

      /**
       * * Guardar transacción en base de datos
       */
      // Generar numero de transaccion
      const traNumero = Math.floor(10000 + Math.random() * 90000);
      const transaccion: Partial<Transaccion> = {
        ...payloadQr,
        traQr: qrBase64,
        traEstado: 'PENDING',
        traNumero: traNumero,
      };
      await this._transaccionRepository.save(transaccion);

      return { traUuid: payloadQr.traUuid, qr: qrBase64 };
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al generar el código QR',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async refrescarEstadoTransaccion(data: obtenerEstadoTransaccionDto) {
    try {
      if (!data.traUuid) {
        return { traUuid: null, traEstado: 'QR NO GENERADO' };
      }

      const transaccion = await this._transaccionRepository.query(`
        SELECT tra_uuid, 
          CASE
            WHEN tra_estado = 'PENDING' THEN 'PENDIENTE'
            WHEN tra_estado = 'APPROVED' THEN 'APROBADO'
            WHEN tra_estado = 'DECLINED' THEN 'DECLINADO'
            ELSE 'QR NO GENERADO'
          END tra_estado, tra_numero
        FROM transaccion 
        WHERE tra_uuid = '${data.traUuid}'  
          AND deleted_at ISNULL
      `);

      return plainToInstance(obtenerEstadoTransac, transaccion[0]);
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al refrescar el estado de la transacción',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async procesarTransaccion(data: procesarTransaccionDto) {
    try {
      // BUSCAR TRANSACCION
      const transaccion = await this.obtenerTransaccion(data.traUuid);

      if (!transaccion) {
        if (data.tokenUsuario) {
          console.log('ENVIO NOTIFICACION NO ENCONTRO LA NOTIFICACION');
          const notificacion: enviarNotificacionDto = {
            token: data.tokenUsuario,
            title: 'Transacción no procesada',
            message: `No se ha encontrado la transacción`,
          };
          console.log('notificacion', notificacion);
          await this._firebaseService.enviarNotificacionPush(notificacion);
        }

        console.log('FIN ENVIO NOTIFICACION NO ENCONTRO LA NOTIFICACION');

        throw new HttpException(
          'Transacción no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      if (transaccion.tra_estado !== 'PENDING') {
        if (data.tokenUsuario) {
          const estado =
            transaccion.tra_estado == 'APPROVED' ? 'APROBADO' : 'DECLINADO';
          const notificacion: enviarNotificacionDto = {
            token: data.tokenUsuario,
            title: 'Transacción no procesada',
            message: `La transacción esta en estado ${estado}, ya no se puede volver a procesar`,
          };
          await this._firebaseService.enviarNotificacionPush(notificacion);
        }

        throw new HttpException(
          'Transacción no está en estado pendiente',
          HttpStatus.BAD_REQUEST,
        );
      }

      /**
       * * Asignar usuario a transaccion
       */

      const transac: Partial<Transaccion> = {
        traUuid: data.traUuid,
        usuUuid: data.usuUuid,
        traMetodoPago: data.traMetodoPago,
      };

      // // await this._transaccionRepository.update(data.traUuid, transac);

      /**
       * * Validaciones para el proceso de transaccion
       */
      // Validar monto mayor a 0
      if (data.traAmount <= 0) {
        if (data.tokenUsuario) {
          const notificacion: enviarNotificacionDto = {
            token: data.tokenUsuario,
            title: 'Transacción no procesada',
            message: `El monto a procesar es inválido.`,
          };
          await this._firebaseService.enviarNotificacionPush(notificacion);
        }

        throw new HttpException(
          'El monto debe ser mayor que cero',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar saldo del usuario
      const saldo = await this._cuentaService.validarSaldoUsuario(data.usuUuid);
      if (saldo[0].cue_saldo < data.traAmount) {
        const rechazar = {
          ...transac,
          traEstado: 'DECLINED',
        };
        await this._transaccionRepository.update(data.traUuid, rechazar);

        if (data.tokenUsuario) {
          const notificacion: enviarNotificacionDto = {
            token: data.tokenUsuario,
            title: 'Transacción no procesada',
            message: `No tiene saldo suficiente para realizar la transacción`,
          };
          await this._firebaseService.enviarNotificacionPush(notificacion);
        }

        throw new HttpException(
          'El saldo del usuario es insuficiente',
          HttpStatus.BAD_REQUEST,
        );
      }

      const aceptar = {
        ...transac,
        traEstado: 'APPROVED',
      };
      await this._transaccionRepository.update(data.traUuid, aceptar);

      const restarSaldo = Number(saldo[0].cue_saldo) - Number(data.traAmount);

      await this._cuentaService.actualizarSaldoUsuario(
        saldo[0].cue_uuid,
        restarSaldo,
      );

      if (data.tokenUsuario) {
        const notificacion: enviarNotificacionDto = {
          token: data.tokenUsuario,
          title: 'Transacción exitosa',
          message: `La transacción ha sido procesada exitosamente`,
        };
        await this._firebaseService.enviarNotificacionPush(notificacion);
      }

      return new utilResponse().setSuccess();
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al procesar la transacción',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerTransaccion(traUuid: string) {
    try {
      const transaccion = await this._transaccionRepository.query(`
        SELECT tra_uuid, tra_amount, tra_currency, tra_metodo_pago, tra_estado, tra_qr, tra_numero
        FROM transaccion
        WHERE tra_uuid = '${traUuid}'
          AND deleted_at ISNULL
      `);

      return transaccion[0];
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al procesar la transacción',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerTransaccionesComercio(data: obtenerTransaccionesComercioDto) {
    try {
      let condicion = '';
      if (data.cliente) {
        condicion += ` AND UPPER(TRIM(TRIM(COALESCE(usu_apellido, '')) || ' ' || TRIM(COALESCE(usu_nombre, '')))) LIKE UPPER('%${data.cliente}%')`;
      }

      if (data.estado && data.estado !== 'TODOS') {
        let est = '';

        if (data.estado === 'PENDIENTE') est = 'PENDING';
        if (data.estado === 'APROBADO') est = 'APPROVED';
        if (data.estado === 'DECLINADO') est = 'DECLINED';

        condicion += ` AND tra.tra_estado = '${est}'`;
      }

      const transaccion = await this._transaccionRepository.query(`
        SELECT usu.usu_uuid, UPPER(TRIM(TRIM(COALESCE(usu_apellido, '')) || ' ' || TRIM(COALESCE(usu_nombre, '')))) cliente,
          tra.tra_uuid, tra.tra_amount, tra.tra_currency, tra.tra_metodo_pago,
          CASE
            WHEN tra_estado = 'PENDING' THEN 'PENDIENTE'
            WHEN tra_estado = 'APPROVED' THEN 'APROBADO'
            WHEN tra_estado = 'DECLINED' THEN 'DECLINADO'
            ELSE ''
          END tra_estado, tra.tra_qr,
          TO_CHAR(tra.created_at, 'YYYY-MM-DD') fecha_creacion, tra.tra_numero
        FROM transaccion tra
        INNER JOIN usuario usu ON usu.usu_uuid = tra.usu_uuid
        WHERE tra.deleted_at ISNULL 
          AND tra.com_uuid = '${data.comUuid}'
          AND tra.usu_uuid IS NOT NULL
          ${condicion}
        ORDER BY tra.created_at DESC;
      `);

      return plainToInstance(obtenerTransaccionesComercioResponse, transaccion);
    } catch (error) {
      if (error.driverError) {
        throw new HttpException(
          'Error al obtener las transacciones del comercio',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // private firmarPayload(payload: ITransaccionPayloadQr): string {
  //   // Ordenar las propiedades para consistencia
  //   const payloadOrdenado = this.ordenarYSerializar(payload);

  //   const hmac = crypto.createHmac('sha256', this.QR_SECRET);
  //   hmac.update(payloadOrdenado);

  //   return hmac.digest('hex');
  // }

  // private ordenarYSerializar(payload: any): string {
  //   // Ordenar alfabéticamente para consistencia
  //   const ordered = Object.keys(payload)
  //     .sort()
  //     .reduce((obj, key) => {
  //       obj[key] = payload[key];
  //       return obj;
  //     }, {});

  //   return JSON.stringify(ordered);
  // }
}
