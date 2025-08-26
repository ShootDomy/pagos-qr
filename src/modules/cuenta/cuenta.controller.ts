import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { obtenerCuentaUsuarioDto } from './dto/cuenta.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cuenta')
@UseGuards(AuthGuard('jwt'))
export class CuentaController {
  constructor(private readonly _cuentaService: CuentaService) {}

  @Get('usuario')
  async obtenerCuentaXUsuario(@Query() data: obtenerCuentaUsuarioDto) {
    console.log('data', data);
    return await this._cuentaService.obtenerCuentaXUsuario(data);
  }
}
