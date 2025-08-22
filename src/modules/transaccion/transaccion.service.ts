import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Transaccion } from './transaccion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generarCodigoQR,
  obtenerEstadoTransaccion,
} from './dto/transaccion.dto';
import { ITransaccionPayloadQr } from './interface/transaccion.interface';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { plainToInstance } from 'class-transformer';
import { obtenerEstadoTransac } from './dto/getTransaccion.fto';
// import * as crypto from 'crypto';

@Injectable()
export class TransaccionService {
  private readonly QR_SECRET: string;
  constructor(
    @InjectRepository(Transaccion)
    private _transaccionRepository: Repository<Transaccion>,
  ) {
    this.QR_SECRET = process.env.QR_SIGNATURE_SECRET!;
  }

  async generarQr(data: generarCodigoQR) {
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
      const transaccion: Partial<Transaccion> = {
        ...payloadQr,
        traEstado: 'PENDING',
      };
      await this._transaccionRepository.save(transaccion);

      return { qr: qrBase64 };
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

  async refrescarEstadoTransaccion(data: obtenerEstadoTransaccion) {
    try {
      const transaccion = await this._transaccionRepository.query(`
        SELECT tra_uuid, tra_estado 
        FROM transaccion 
        WHERE tra_uuid = '${data.traUuid}'  
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
