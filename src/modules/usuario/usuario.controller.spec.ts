import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { CuentaService } from '../cuenta/cuenta.service';

describe('UsuarioController', () => {
  let controller: UsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            query: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
        {
          provide: CuentaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
