import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ServService } from './serv.service';
import { Serv } from './serv.schema';

describe('ServService', () => {
  let service: ServService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServService,
        {
          provide: getModelToken(Serv.name),
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

    service = module.get<ServService>(ServService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
