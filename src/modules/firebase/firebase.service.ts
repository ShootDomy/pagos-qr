import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import serviceAccount from '../../../pagos-qr-2da58-firebase-adminsdk-fbsvc-f1d48ceaad.json';

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

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message = {
      notification: { title, body },
      data: data || {},
      token,
    };
    try {
      const response = await admin.messaging().send(message);
      return { success: true, response };
    } catch (error) {
      return { success: false, error };
    }
  }
}
