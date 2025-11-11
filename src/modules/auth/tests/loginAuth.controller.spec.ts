import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';
import { LoginUsersModel } from '../model/loginUsers.model';
import { USERS_REPOSITORY_INTERFACE } from '../../users/interfaces/repository/iUsersRepository.interface';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { BadRequestException, HttpStatus, INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AllExceptionsFilter } from '../../../error/AllExceptionsFilter';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE } from '../interfaces/repository/iAttemptsBlockedRepository.interface';


//INICIO LOGIN USERS

describe('AuthController - login', () => {
  let app: INestApplication;
  let controller: AuthController;
  let service: AuthService;

  const BASE_URL: string = '/api/v1/auth';

  const mockUsersRepository = {
    findOneByEmail: jest.fn(),
    updateIsActive: jest.fn(),
  };

  const mockAttemptsBlockedRepository = {
    create: jest.fn(),
    findAttemptsByUserId: jest.fn(),
    deleteAttemptsById: jest.fn(),
    updateAttempts: jest.fn(),
    updateIsBlocked: jest.fn(),
  };

  const passwordHasherMock = {
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    verify: jest.fn().mockResolvedValue(true),
  };

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
  };

  const mockAuthServices = {
    login: jest.fn(),
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
          provide: ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE,
          useValue: mockAttemptsBlockedRepository,
        },
        {
          provide: PasswordHasherd,
          useValue: passwordHasherMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        LoginUsersMapper,
        LoginUsersModel,
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors) => {
      const resultErrors = errors.map(er => ({
        property: er.property,
        errorMessage: Object.values(er.constraints || {}).join(', '),
      }));
      return new BadRequestException({
        message: 'Validation error',
        errors: resultErrors 
        });
      },
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 when password has less then 8 characters', async () => {
    const loginUserDto = {
      email: 'testuser@example.com',
      password: 'Shot12@'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginUserDto)
      .expect(HttpStatus.BAD_REQUEST);
    
    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
              errorMessage: 'Password invalid'
            }
          ]
        }
      }
    });
    expect(mockAuthServices.login).not.toHaveBeenCalled();
  })

  it('should return 400 when password has more then 20 characters', async () => {
    const loginUserDto = {
      email: 'testuser@example.com',
      password: 'Shot12@12345678901234567890'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginUserDto)
      .expect(HttpStatus.BAD_REQUEST);
    
    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
              errorMessage: 'Password invalid'
            }
          ]
        }
      }
    });
    expect(mockAuthServices.login).not.toHaveBeenCalled();
  })

  it('should return 400 when password is wrong', async () => {
    const loginUserDto = {
      email: 'testuser@example.com',
      password: 'Shot12@1234',
    };

    const dateCreated = new Date();
    const userEntity = {
      id: 'newUserId',
      displayName: 'displayName',
      email: 'test@example.com',
      role: { id: 1 },
      password: 'hashedPassword',
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: false,
    } as UsersEntity;

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    (passwordHasherMock.verify as jest.Mock).mockResolvedValueOnce(false);

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: 'Invalid Email or Password.',
        },
      },
    });
    expect(mockAuthServices.login).not.toHaveBeenCalled();
  });


  it('should return 400 when email has less than 5 characters', async () => {
    const loginUserDto = {
      email: 'e@e.c',
      password: 'Shot12@1234'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginUserDto)
      .expect(HttpStatus.BAD_REQUEST);
    
    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'email',
              errorMessage: 'Email invalid'
            }
          ]
        }
      }
    });
    expect(mockAuthServices.login).not.toHaveBeenCalled();
  })

  it('should return 400 when email has less than 40 characters', async () => {
    const loginUserDto = {
      email: 'aaaaaaaaaaaaaaaaaaaayaaaaaaaa@example.com',
      password: 'Shot12@1234'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginUserDto)
      .expect(HttpStatus.BAD_REQUEST);
    
    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'email',
              errorMessage: 'Email invalid'
            }
          ]
        }
      }
    });
    expect(mockAuthServices.login).not.toHaveBeenCalled();
  })

  it('should return 400 when email does not contain a correct format', async () => {
    const loginDto = {
      email: 'tr3dsd4.com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'email',
              errorMessage: 'Email invalid'
            }
          ]
        }
      }
    });
    expect(mockAuthServices.login).not.toHaveBeenCalled();
  })

  it('should return 400 when email does not contain a correct format 2', async () => {
    const loginDto = {
      email: 'tr3ds@dfsdfcom',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'email',
              errorMessage: 'Email invalid'
            }
          ]
        }
      }
    });
    expect(mockAuthServices.login).not.toHaveBeenCalled();
  })

  it('should return 400 when email does not found', async () => {
    const loginDto = {
      email: 'tr3ds@example.com',
      password: 'SHOT2@3Password'
    }

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(null);
    
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Invalid Email or Password."
        }
      }
    });
  })

  it('should return 400 when password is invalid', async () => {
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

    const loginDto = {
      email: userEntity.email,
      password: 'SHOT2@3Password'
    }

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    (passwordHasherMock.verify as jest.Mock).mockResolvedValueOnce(false);
    
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 400,
        errorText: {
          message: "Invalid Email or Password."
        }
      }
    });
  })

it('should return 200 and jwt when login is valid', async () => {
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

    const loginDto = {
      email: userEntity.email,
      password: userEntity.password,
    }


    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    (passwordHasherMock.verify as jest.Mock).mockResolvedValueOnce(true);
    
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.OK);

    expect(response.body).toMatchObject({
      access_token: "fake-jwt-token",
      token_type: "Bearer",
    });
  })

  //FIM LOGIN TESTSpath: `${BASE_URL}/login`,
});