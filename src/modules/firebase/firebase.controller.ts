import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { enviarNotificacionDto } from './dto/firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly _firebaseService: FirebaseService) {}

  @Post('send-notification')
  async enviarNotificacionPush(@Body() data: enviarNotificacionDto) {
    return await this._firebaseService.enviarNotificacionPush(data);
  }
}
