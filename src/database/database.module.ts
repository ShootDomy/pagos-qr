import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../modules/usuario/usuario.entity';
import { Cuenta } from '../modules/cuenta/cuenta.entity';
import { Comerciante } from '../modules/comerciante/comerciante.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [Usuario, Cuenta, Comerciante],
        synchronize: true,
        logging: true,
        logger: 'advanced-console',
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
