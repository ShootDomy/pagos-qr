import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import serviceAccount from '../../../pagos-qr-2da58-firebase-adminsdk-fbsvc-f1d48ceaad.json';
import { utilResponse } from '../../utils/utilResponse';
import { enviarNotificacionDto } from './dto/firebase.dto';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
  }

  async enviarNotificacionPush(data: enviarNotificacionDto) {
    const notificacion = {
      notification: { title: data.title, body: data.message },
      data: data.data || {},
      token: data.token,
    };
    try {
      // const response =
      await admin.messaging().send(notificacion);

      return new utilResponse().setSuccess();
    } catch (error) {
      return { success: false, error };
    }
  }
}
