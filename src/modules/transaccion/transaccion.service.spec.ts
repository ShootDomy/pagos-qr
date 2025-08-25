import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionService } from './transaccion.service';
import { Transaccion } from './transaccion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cuenta } from '../cuenta/cuenta.entity';
import { CuentaService } from '../cuenta/cuenta.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ComercianteService } from '../comerciante/comerciante.service';

describe('TransaccionService', () => {
  let service: TransaccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransaccionService,
        {
          provide: getRepositoryToken(Transaccion),
          useValue: {
            save: jest.fn(),
            query: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cuenta),
          useValue: {
            save: jest.fn(),
            query: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: CuentaService,
          useValue: {},
        },
        {
          provide: FirebaseService,
          useValue: {},
        },
        {
          provide: ComercianteService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TransaccionService>(TransaccionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
