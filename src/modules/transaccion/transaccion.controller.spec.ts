import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionController } from './transaccion.controller';
import { TransaccionService } from './transaccion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaccion } from './transaccion.entity';
import { CuentaService } from '../cuenta/cuenta.service';

describe('TransaccionController', () => {
  let controller: TransaccionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransaccionController],
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
            // otros métodos de Repository si son necesarios
          },
        },
        {
          provide: CuentaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TransaccionController>(TransaccionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
