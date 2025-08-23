import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { CuentaService } from '../cuenta/cuenta.service';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
