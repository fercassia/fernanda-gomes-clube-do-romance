import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import * as bcrypt from 'bcrypt';
import { USERS_REPOSITORY_INTERFACE } from '../interfaces/repository/iUsersRepository.interface';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    findByEmailOrDisplayName: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY_INTERFACE,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException if email already exists', async () => {
    const dtoCreateUser1: CreateUsersRequestDto = {
      email: 'test@example.com',
      displayName: 'testuser',
      password: 'Password!@#344',
    };

    mockUsersRepository.findByEmailOrDisplayName.mockResolvedValueOnce({
      id: 'existingUserId',
      email: dtoCreateUser1.email,
      displayName: 'bananaUser',
      password: 'hashedPassword',
    });
    await expect(service.create(dtoCreateUser1)).rejects.toThrow(ConflictException);
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if display name already exists', async () => {
    const dtoCreateUser1: CreateUsersRequestDto = {
      email: 'test@example.com',
      displayName: 'testuser',
      password: 'Password!@#344',
    };

    mockUsersRepository.findByEmailOrDisplayName.mockResolvedValueOnce({
      id: 'existingUserId',
      email: 'testoutro@example.com' ,
      displayName: dtoCreateUser1.displayName,
      password: 'hashedPassword',
    });
    await expect(service.create(dtoCreateUser1)).rejects.toThrow(ConflictException);
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('should create User correctly', async () => {
    const dtoCreateUser1: CreateUsersRequestDto = {
      email: 'test@example.com',
      displayName: 'testuser',
      password: 'Password!@#344',
    };

    mockUsersRepository.findByEmailOrDisplayName.mockResolvedValueOnce(null);

    const dateCreated = new Date(); 
    const createUserEntity = {
      id: 'newUserId',
      displayName: dtoCreateUser1.displayName,
      email: dtoCreateUser1.email,
      role: { id: 1 },
      password: 'hashedPassword',
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: false
    };

    mockUsersRepository.create.mockResolvedValueOnce(createUserEntity);

    await expect(service.create(dtoCreateUser1)).resolves.toEqual({
      id: 'newUserId',
      displayName: dtoCreateUser1.displayName,
      email: dtoCreateUser1.email,
      createdAt: dateCreated.toString(),
    });

    expect(mockUsersRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      displayName: dtoCreateUser1.displayName,
      email: dtoCreateUser1.email,
      password: 'hashedPassword',
      role: { id: 1 },
    }));
  });
});