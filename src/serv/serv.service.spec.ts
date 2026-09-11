import { Test, TestingModule } from '@nestjs/testing';
import { ServService } from './serv.service';

describe('ServService', () => {
  let service: ServService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServService],
    }).compile();

    service = module.get<ServService>(ServService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
