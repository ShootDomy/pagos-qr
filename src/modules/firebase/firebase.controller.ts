import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { enviarNotificacion } from './dto/firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly _firebaseService: FirebaseService) {}

  @Post('notificacion/enviar')
  async sendNotification(@Body() data: enviarNotificacion) {
    return await this._firebaseService.sendPushNotification(data);
  }

  @Post('notificacion/test')
  async sendTestNotification(@Body() data: enviarNotificacion) {
    return await this._firebaseService.sendPushNotification(data);
  }
}
