import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import {
  generarCodigoQRDto,
  obtenerEstadoTransaccionDto,
  obtenerTransaccionesComercioDto,
  procesarTransaccionDto,
} from './dto/transaccion.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transaccion')
@UseGuards(AuthGuard('jwt'))
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

  @Get('comercio')
  async obtenerTransaccionesComercio(
    @Query() data: obtenerTransaccionesComercioDto,
  ) {
    return await this._transaccionService.obtenerTransaccionesComercio(data);
  }
}
