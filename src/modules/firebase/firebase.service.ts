import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import serviceAccount from '../../../pagosqr-f7d39-firebase-adminsdk-fbsvc-c51a566d74.json';
import { enviarNotificacion } from './dto/firebase.dto';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private messaging: admin.messaging.Messaging;

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });

      this.messaging = admin.messaging();
    }
  }

  async sendPushNotification(datos: enviarNotificacion) {
    const message: admin.messaging.Message = {
      token: datos.token,
      notification: { title: datos.title, body: datos.message },
      data: datos.data || {},
    };

    return await this.messaging.send(message);
  }
}
