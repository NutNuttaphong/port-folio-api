import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InspirationService } from './inspiration.service';
import { Inspiration } from './inspiration.schema';

describe('InspirationService', () => {
  let service: InspirationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspirationService,
        {
          provide: getModelToken(Inspiration.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InspirationService>(InspirationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
