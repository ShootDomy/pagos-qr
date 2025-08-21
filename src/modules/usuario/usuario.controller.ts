import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { inicioSesionUsuario, registroUsuario } from './dto/usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly _usuarioService: UsuarioService) {}

  @Post('auth/registro')
  async registroUsuario(@Body() usuario: registroUsuario) {
    return await this._usuarioService.registrarUsuario(usuario);
  }

  @Post('auth/inicio')
  async inicioSesion(@Body() usuario: inicioSesionUsuario) {
    return await this._usuarioService.inicioSesionUsuario(usuario);
  }
}
