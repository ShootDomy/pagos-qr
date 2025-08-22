import { Expose } from 'class-transformer';

@Expose()
export class enviarNotificacion {
  token: string;
  title: string;
  message: string;
  data?: {};
}
