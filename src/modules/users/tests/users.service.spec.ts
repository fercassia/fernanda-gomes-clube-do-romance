import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { USERS_REPOSITORY_INTERFACE } from '../interfaces/repository/iUsersRepository.interface';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { UsersModel } from '../model/users.model';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { UsersEntity } from '../entities/users.entity';
import { LoginUsersModel } from '../model/loginUsers.model';
import { mock } from 'node:test';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {

  let service: UsersService;

  const mockUsersRepository = {
    findByEmailOrDisplayName: jest.fn(),
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    updateIsActive: jest.fn(),
  };

  const passwordHasherMock = {
      hash: jest.fn().mockResolvedValue('hashedPassword'),
      verify: jest.fn().mockResolvedValue(true),
  };

  beforeAll(() => Logger.overrideLogger(false));
  afterAll(() => Logger.overrideLogger(true));

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY_INTERFACE,
          useValue: mockUsersRepository,
        },
        {
         provide: PasswordHasherd,
         useValue: passwordHasherMock,
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

//USER CREATION TESTS START

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
    await expect(service.create(CreateUsersMapper.toModel(dtoCreateUser1))).rejects.toThrow(ConflictException);
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
    await expect(service.create(CreateUsersMapper.toModel(dtoCreateUser1))).rejects.toThrow(ConflictException);
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('should create User correctly', async () => {
    const dtoCreateUser1: CreateUsersRequestDto = {
      email: 'test@example.com',
      displayName: 'testuser',
      password: 'Password!@#344',
    };

    const senha = await passwordHasherMock.hash(dtoCreateUser1.password);
    const dtoNovoUserComSenhaHash = {
      ...dtoCreateUser1,
      password: senha,
    };
    const userModel: UsersModel = CreateUsersMapper.toModel(dtoNovoUserComSenhaHash);

    mockUsersRepository.findByEmailOrDisplayName.mockResolvedValueOnce(null);

    const dateCreated = new Date(); 
    const createUserEntity = {
      id: 'newUserId',
      displayName: userModel.displayName,
      email: userModel.email,
      role: { id: userModel.role },
      password: userModel.password,
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: false
    } as UsersEntity;

    mockUsersRepository.create.mockResolvedValueOnce(createUserEntity);

    await expect(service.create(userModel)).resolves.toEqual({
      id: 'newUserId',
      displayName: dtoCreateUser1.displayName,
      email: dtoCreateUser1.email,
      createdAt: dateCreated.toString(),
    });

    expect(passwordHasherMock.hash).toHaveBeenCalledWith(dtoCreateUser1.password);
    expect(mockUsersRepository.findByEmailOrDisplayName).toHaveBeenCalledWith(userModel.displayName, userModel.email);
    expect(mockUsersRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        displayName: userModel.displayName,
        email: userModel.email,
        role: { id: 1 },
        password: userModel.password,
    }));
  });

//USER CREATION TESTS END

//USER LOGIN TESTS START

  it('should throw Bad Request if email was not not found', async () => {
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'Password!@#344');
    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(null);
    await expect(service.login(loginModel)).rejects.toThrow(BadRequestException);
    expect(mockUsersRepository.updateIsActive).not.toHaveBeenCalled();
  });

  it('should throw Bad Request if password was incorrect', async () => {
    const dateCreated = new Date(); 
    const userEntity = {
      id: 'newUserId',
      displayName: 'displayName',
      email: 'test@example.com',
      role: { id: 1},
      password:  'hashedPassword',
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: false
    } as UsersEntity;
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'wrongPassword');
    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    (passwordHasherMock.verify as jest.Mock).mockResolvedValueOnce(false);
    await expect(service.login(loginModel)).rejects.toThrow(BadRequestException);
    expect(mockUsersRepository.updateIsActive).not.toHaveBeenCalled();
  });

  it('should Not active user if password is incorrect', async () => {
    const dateCreated = new Date(); 
    const userEntity = {
      id: 'newUserId',
      displayName: 'displayName',
      email: 'test@example.com',
      role: { id: 1},
      password:  'hashedPassword',
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: false
    } as UsersEntity;
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'wrongPassword');
    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    (passwordHasherMock.verify as jest.Mock).mockResolvedValueOnce(false);

    await expect(service.login(loginModel)).rejects.toThrow(BadRequestException);
    expect(mockUsersRepository.updateIsActive).not.toHaveBeenCalled();
    expect(userEntity.isActive).toBe(false);
  });

  it('should active user again user if is already active', async () => {
    const dateCreated = new Date(); 
    const userEntity = {
      id: 'newUserId',
      displayName: 'displayName',
      email: 'test@example.com',
      role: { id: 1},
      password:  'hashedPassword',
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: true
    } as UsersEntity;
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'correctPassword');
    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);

    expect(mockUsersRepository.updateIsActive).not.toHaveBeenCalled();
    expect(userEntity.isActive).toBe(true);
  });

  it('should activate user if email and password is correct', async () => {
    const dateCreated = new Date(); 
    const userEntity = {
      id: 'newUserId',
      displayName: 'displayName',
      email: 'test@example.com',
      role: { id: 1},
      password:  'hashedPassword',
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: false
    } as UsersEntity;
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'hashedPassword');
    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    (passwordHasherMock.verify as jest.Mock).mockResolvedValueOnce(true);


    mockUsersRepository.updateIsActive.mockImplementationOnce(async (id: string) => {
      if(id === userEntity.id) {
        userEntity.isActive = true;
      }
      return Promise.resolve(userEntity);
    });

    await service.login(loginModel);

    expect(mockUsersRepository.updateIsActive).toHaveBeenCalledWith(userEntity.id);
    expect(userEntity.isActive).toBe(true);
  });
});