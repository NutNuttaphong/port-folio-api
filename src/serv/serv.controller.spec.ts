import { Test, TestingModule } from '@nestjs/testing';
import { ServController } from './serv.controller';
import { ServService } from './serv.service';

describe('ServController', () => {
  let controller: ServController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServController],
      providers: [
        {
          provide: ServService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServController>(ServController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
