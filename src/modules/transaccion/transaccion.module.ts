import { Module } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaccion } from './transaccion.entity';
import { CuentaModule } from '../cuenta/cuenta.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { ComercianteModule } from '../comerciante/comerciante.module';

@Module({
  controllers: [TransaccionController],
  providers: [TransaccionService],
  exports: [TransaccionService],
  imports: [
    TypeOrmModule.forFeature([Transaccion]),
    CuentaModule,
    FirebaseModule,
    ComercianteModule,
  ],
})
export class TransaccionModule {}
