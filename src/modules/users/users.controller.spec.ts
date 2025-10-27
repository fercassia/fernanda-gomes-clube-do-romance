import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/controllers/users.controller';
import { UsersService } from './services/users.service';
import { USERS_REPOSITORY_INTERFACE } from './interfaces/repository/iUsersRepository.interface';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY_INTERFACE,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});