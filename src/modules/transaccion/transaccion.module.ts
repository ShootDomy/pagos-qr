import { Module } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaccion } from './transaccion.entity';

@Module({
  controllers: [TransaccionController],
  providers: [TransaccionService],
  exports: [TransaccionService],
  imports: [TypeOrmModule.forFeature([Transaccion])],
})
export class TransaccionModule {}
