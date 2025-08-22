import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { CuentaModule } from './modules/cuenta/cuenta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsuarioModule,
    CuentaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
