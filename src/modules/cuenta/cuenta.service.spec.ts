import { Test, TestingModule } from '@nestjs/testing';
import { CuentaService } from './cuenta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';

describe('CuentaService', () => {
  let service: CuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: getRepositoryToken(Cuenta),
          useValue: {
            save: jest.fn(),
            query: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
