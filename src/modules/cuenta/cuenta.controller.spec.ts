import { Test, TestingModule } from '@nestjs/testing';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';

describe('CuentaController', () => {
  let controller: CuentaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuentaController],
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

    controller = module.get<CuentaController>(CuentaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
