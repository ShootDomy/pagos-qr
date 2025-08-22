import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import {
  generarCodigoQRDto,
  obtenerEstadoTransaccionDto,
  procesarTransaccionDto,
} from './dto/transaccion.dto';

@Controller('transaccion')
export class TransaccionController {
  constructor(private readonly _transaccionService: TransaccionService) {}

  @Post('qr')
  async generarCodigoQr(@Body() data: generarCodigoQRDto) {
    return await this._transaccionService.generarQr(data);
  }

  @Get('estado')
  async obtenerEstadoTransaccion(@Query() data: obtenerEstadoTransaccionDto) {
    return await this._transaccionService.refrescarEstadoTransaccion(data);
  }

  @Post('procesar')
  async procesarTransaccion(@Body() data: procesarTransaccionDto) {
    return await this._transaccionService.procesarTransaccion(data);
  }
}
