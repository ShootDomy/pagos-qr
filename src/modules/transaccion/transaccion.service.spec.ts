import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionService } from './transaccion.service';
import { Transaccion } from './transaccion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cuenta } from '../cuenta/cuenta.entity';

describe('TransaccionService', () => {
  let service: TransaccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransaccionService,
        {
          provide: getRepositoryToken(Transaccion),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Cuenta),
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
