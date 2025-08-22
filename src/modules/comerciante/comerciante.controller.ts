import { Controller, Get } from '@nestjs/common';
import { ComercianteService } from './comerciante.service';

@Controller('comerciante')
export class ComercianteController {
  constructor(private readonly _comercianteService: ComercianteService) {}

  @Get()
  async obtenerComerciantes() {
    return await this._comercianteService.obtenerComerciantes();
  }
}
