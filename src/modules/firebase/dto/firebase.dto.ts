import { Expose } from 'class-transformer';

@Expose()
export class enviarNotificacionDto {
  token: string;
  title: string;
  message: string;
  data?: any;
}
