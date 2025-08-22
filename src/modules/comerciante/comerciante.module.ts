import { Module } from '@nestjs/common';
import { ComercianteService } from './comerciante.service';
import { ComercianteController } from './comerciante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comerciante } from './comerciante.entity';

@Module({
  controllers: [ComercianteController],
  providers: [ComercianteService],
  imports: [TypeOrmModule.forFeature([Comerciante])],
  exports: [ComercianteService],
})
export class ComercianteModule {}
