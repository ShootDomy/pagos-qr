import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly _firebaseService: FirebaseService) {}

  @Post('send-notification')
  async sendNotification(
    @Body() body: { token: string; title: string; message: string; data?: any },
  ) {
    return await this._firebaseService.sendPushNotification(
      body.token,
      body.title,
      body.message,
      body.data,
    );
  }
}
