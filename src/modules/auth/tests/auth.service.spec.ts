import { Test, TestingModule } from '@nestjs/testing';
import { USERS_REPOSITORY_INTERFACE } from '../../users/interfaces/repository/iUsersRepository.interface';
import { BadRequestException, Logger } from '@nestjs/common';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { UsersEntity } from '../../users/entities/users.entity';
import { LoginUsersModel } from '../model/loginUsers.model';
import { JwtService } from '@nestjs/jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';
import { AuthService } from '../services/auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('AuthService', () => {

  let auth: AuthService;

  const mockUsersRepository = {
    findOneByEmail: jest.fn(),
    updateIsActive: jest.fn(),
  };

  const passwordHasherMock = {
      hash: jest.fn().mockResolvedValue('hashedPassword'),
      verify: jest.fn().mockResolvedValue(true),
  };


  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
  };

  beforeAll(() => Logger.overrideLogger(false));
  afterAll(() => Logger.overrideLogger(true));

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USERS_REPOSITORY_INTERFACE,
          useValue: mockUsersRepository,
        },
        {
          provide: PasswordHasherd,
          useValue: passwordHasherMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        LoginUsersMapper, // se preferir, pode mockar também
        LoginUsersModel,  // opcional: só necessário se for instanciado/used
      ],
    }).compile();

    auth = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(auth).toBeDefined();
  });

  //USER LOGIN TESTS START

  it('should throw Bad Request if email was not not found', async () => {
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'Password!@#344');
    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(null);
    await expect(auth.login(loginModel)).rejects.toThrow(BadRequestException);
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
    await expect(auth.login(loginModel)).rejects.toThrow(BadRequestException);
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

    await expect(auth.login(loginModel)).rejects.toThrow(BadRequestException);
    expect(mockUsersRepository.updateIsActive).not.toHaveBeenCalled();
    expect(userEntity.isActive).toBe(false);
  });

  it('should Not return jwt if user password is incorrect', async () => {
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

    await expect(auth.login(loginModel)).rejects.toThrow(BadRequestException);
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('should Not return jwt if user email is incorrect', async () => {
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'wrongPassword');
    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(false);

    await expect(auth.login(loginModel)).rejects.toThrow(BadRequestException);
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
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

    await auth.login(loginModel);

    expect(mockUsersRepository.updateIsActive).toHaveBeenCalledWith(userEntity.id);
    expect(userEntity.isActive).toBe(true);
  });


  it('should return jwt if user is correct', async () => {
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
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'correctPassword');

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    passwordHasherMock.verify.mockResolvedValueOnce(true);
    jwtServiceMock.sign.mockReturnValueOnce('fake-jwt-token');

    const response = await auth.login(loginModel);

    expect(response).toEqual(LoginUsersMapper.toResponse('fake-jwt-token'));
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({ id: userEntity.id, email: userEntity.email, displayName: userEntity.displayName });
  });

  it('should return jwt correctly', async () => {
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
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'correctPassword');

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    passwordHasherMock.verify.mockResolvedValueOnce(true);
    jwtServiceMock.sign.mockReturnValueOnce(
      jsonwebtoken.sign(
        { id: userEntity.id, email: userEntity.email, displayName: userEntity.displayName },
        'test-secret'
      )
    );

    const response = await auth.login(loginModel);
    const decodedToken = jsonwebtoken.verify(response.access_token, 'test-secret') as any;

    expect(decodedToken).toBeDefined();
    expect(decodedToken.email).toBe(userEntity.email);
    expect(decodedToken.id).toBe(userEntity.id);
    expect(decodedToken.displayName).toBe(userEntity.displayName);
  });

  it('should return time jwt correctly', async () => {
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
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'correctPassword');

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    passwordHasherMock.verify.mockResolvedValueOnce(true);
    jwtServiceMock.sign.mockReturnValueOnce(
      jsonwebtoken.sign(
        { id: userEntity.id, email: userEntity.email, displayName: userEntity.displayName },
        'test-secret',
        {expiresIn: '30m'}
      )
    );

    const response = await auth.login(loginModel);
    const decodedToken = jsonwebtoken.verify(response.access_token, 'test-secret') as any;

    expect(decodedToken).toBeDefined();
    expect(decodedToken.exp).toBeDefined();
    expect(decodedToken.iat).toBeDefined();
    expect(decodedToken.exp - decodedToken.iat).toBe(1800); // 30 minutes in seconds
  });

  it('should return time jwt finallized', async () => {
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
    const loginModel: LoginUsersModel = new LoginUsersModel('test@example.com', 'correctPassword');

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    passwordHasherMock.verify.mockResolvedValueOnce(true);
    jwtServiceMock.sign.mockReturnValueOnce(
      jsonwebtoken.sign(
        { id: userEntity.id, email: userEntity.email, displayName: userEntity.displayName },
        'test-secret', { expiresIn: -1 }
      )
    );

    const response = await auth.login(loginModel);
    expect(() => {
      jsonwebtoken.verify(response.access_token, 'test-secret');
    }).toThrow(jsonwebtoken.TokenExpiredError);
  });
 //USER LOGIN TESTS END
});