import { Injectable } from '@nestjs/common';

@Injectable()
export class utilResponse {
  codigo: number | null = null;
  mensaje = '';

  setSuccess(): { codigo: number; mensaje: string } {
    return { codigo: 1, mensaje: 'EXITO' };
  }
}
