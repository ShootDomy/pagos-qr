import crypto from 'crypto';
// Solo asigna si globalThis.crypto no existe
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto;
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cuenta } from '../modules/cuenta/cuenta.entity';
import { Usuario } from '../modules/usuario/usuario.entity';
import { Comerciante } from '../modules/comerciante/comerciante.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const cuentaRepo = app.get<Repository<Cuenta>>(getRepositoryToken(Cuenta));
  const usuarioRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  const comercianteRepo = app.get<Repository<Comerciante>>(
    getRepositoryToken(Comerciante),
  );

  // Insertar comercio
  const uuidComercio = uuidv4();
  await comercianteRepo.save([
    { comUuid: uuidComercio, comNombre: 'Comercio 1' },
  ] as Comerciante[]);

  // Insertar usuarios
  const uuidUsuCliente = uuidv4();
  const uuidUsuComercio = uuidv4();
  await usuarioRepo.save([
    // usuario cliente
    {
      usuUuid: uuidUsuCliente,
      usuNombre: 'Domy',
      usuApellido: 'Vintimilla',
      usuCorreo: 'domy@example.com',
      usuContrasena: await bcrypt.hash('domy1234', 10),
      comUuid: null,
    },

    // usuario comercio
    {
      usuUuid: uuidUsuComercio,
      usuNombre: 'Ana',
      usuApellido: 'Gomez',
      usuCorreo: 'ana@example.com',
      usuContrasena: await bcrypt.hash('ana12345', 10),
      comUuid: uuidComercio,
    },
  ] as Usuario[]);

  // Insertar cuentas
  await cuentaRepo.save([
    {
      cueUuid: uuidv4(),
      cueNumCuenta: 789456,
      cueSaldo: 154,
      usuUuid: uuidUsuCliente,
    },
    {
      cueUuid: uuidv4(),
      cueNumCuenta: 78549,
      cueSaldo: 456,
      usuUuid: uuidUsuComercio,
    },
  ] as Cuenta[]);

  await app.close();
}

seed();
