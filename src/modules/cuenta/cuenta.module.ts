import { Module } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CuentaController } from './cuenta.controller';
import { Cuenta } from './cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CuentaController],
  providers: [CuentaService],
  imports: [TypeOrmModule.forFeature([Cuenta])],
  exports: [CuentaService],
})
export class CuentaModule {}
