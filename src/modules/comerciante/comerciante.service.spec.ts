import { Test, TestingModule } from '@nestjs/testing';

import { ComercianteService } from './comerciante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comerciante } from './comerciante.entity';

describe('ComercianteService', () => {
  let service: ComercianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComercianteService,
        {
          provide: getRepositoryToken(Comerciante),
          useValue: {}, // Mock básico
        },
      ],
    }).compile();

    service = module.get<ComercianteService>(ComercianteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
