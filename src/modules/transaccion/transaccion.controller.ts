import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import {
  generarCodigoQR,
  obtenerEstadoTransaccion,
} from './dto/transaccion.dto';

@Controller('transaccion')
export class TransaccionController {
  constructor(private readonly _transaccionService: TransaccionService) {}

  @Post('qr')
  async generarCodigoQr(@Body() data: generarCodigoQR) {
    return await this._transaccionService.generarQr(data);
  }

  @Get('estado')
  async obtenerEstadoT(@Query() data: obtenerEstadoTransaccion) {
    return await this._transaccionService.refrescarEstadoTransaccion(data);
  }
}
