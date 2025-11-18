import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';
import { LoginUsersModel } from '../model/loginUsers.model';
import { USERS_REPOSITORY_INTERFACE } from '../../users/interfaces/repository/iUsersRepository.interface';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { BadRequestException, HttpStatus, INestApplication, Logger, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../../../error/AllExceptionsFilter';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from '../../../modules/users/entities/users.entity';
import { LoginFailureInterceptor } from '../../../config/cache/login-failure.interceptor';
import { LoginAttemptGuard } from '../../../config/cache/login-attempt.guard';
import request from 'supertest';
import 'reflect-metadata';
import { LoginAttemptService } from '../../../config/cache/loginAttempt.service';

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

  const passwordHasherMock = {
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    verify: jest.fn().mockResolvedValue(true),
  };

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
  };
  
  const mockAuthServices = { 
    login: jest.fn()
  };

  const mockLoginAttemptService = {
    getAttempts: jest.fn().mockResolvedValue(0),
    getTtl: jest.fn().mockResolvedValue(7200),
    incrementAttempts: jest.fn().mockResolvedValue({ attempts: 0, remaining: 5, isBlocked: false }),    
    isBlocked: jest.fn().mockResolvedValue(false),
};

  beforeAll(() => Logger.overrideLogger(false));
  afterAll(() => Logger.overrideLogger(true));

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthServices,
        },
        {
          provide: USERS_REPOSITORY_INTERFACE,
          useValue: mockUsersRepository,
        },
        {
          provide: LoginAttemptService,
          useValue: mockLoginAttemptService,
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
        LoginAttemptGuard,
        LoginFailureInterceptor,
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
    app.useGlobalInterceptors(module.get(LoginFailureInterceptor));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 when password has more then 20 characters', async () => {
    const loginUserDto = {
      email: 'testuser@example.com',
      password: 'Shot12@12345678901234',
    };

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

  it('should return 401 when password is wrong', async () => {
    const dateCreated = new Date();
    const userEntity = {
      id: 'userId',
      displayName: 'Test User',
      email: 'testuser@example.com',
      role: { id: 1 },
      password: 'hashedPassword',
      createdAt: dateCreated,
      updatedAt: dateCreated,
      isActive: true
    } as UsersEntity;

    const loginUserDto = {
      email: userEntity.email,
      password: 'Shot12@1234',
    };

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    mockAuthServices.login.mockRejectedValueOnce(new UnauthorizedException('Invalid Email or Password.'));

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginUserDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 401,
        errorText: {
          message: 'Invalid Email or Password.',
        },
      },
    });
  });

  it('should return 400 when email has more than 100 characters', async () => {
    const loginUserDto = {
      email: 'hduahsduashduahduahsduashduashduashduashduahdaushdguashdausdhausdhaodhas@ashduashduashdaausdhaush.com',
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

  it('should return 401 when email does not found', async () => {
    const loginUserDto = {
      email: "userEntity.email@email.com",
      password: 'Shot12@1234',
    };

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(null);
    mockAuthServices.login.mockRejectedValueOnce(new UnauthorizedException('Invalid Email or Password.'));

    
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginUserDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 401,
        errorText: {
          message: "Invalid Email or Password."
        }
      }
    });
  })

  it('should return 401 and attempts when password is invalid', async () => {
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
    };

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    passwordHasherMock.verify.mockResolvedValueOnce(false);
    mockLoginAttemptService.incrementAttempts.mockResolvedValueOnce({ attempts: 1, remaining: 5, isBlocked: false });
    mockAuthServices.login.mockRejectedValueOnce(new UnauthorizedException('Invalid Email or Password.'));

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(mockLoginAttemptService.incrementAttempts).toHaveBeenCalled();

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 401,
       errorText: {
          message: "Invalid Email or Password.",
          remainingAttempts: 5
        }
      }
    });
  })

it('should return 429 and user blocked when password is invalid 6 times', async () => {
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
    };

    mockUsersRepository.findOneByEmail.mockResolvedValueOnce(userEntity);
    passwordHasherMock.verify.mockResolvedValueOnce(false);
    mockLoginAttemptService.incrementAttempts.mockResolvedValueOnce({ attempts: 6, remaining: 0, isBlocked: true, retryAfterMinutes: 120 });
    mockAuthServices.login.mockRejectedValueOnce(new UnauthorizedException('Invalid Email or Password.'));

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.TOO_MANY_REQUESTS);

    expect(mockLoginAttemptService.incrementAttempts).toHaveBeenCalled();
    mockLoginAttemptService.getTtl.mockResolvedValueOnce(7200);

    expect(response.body).toMatchObject({
      path: `${BASE_URL}/login`,
      cause: {
        status: 429,
       errorText: {
          message: "Too many login attempts. Please try again later.",
          remainingAttempts: 0,
          retryAfterMinutes: 120
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
    passwordHasherMock.verify.mockResolvedValueOnce(true);
    mockAuthServices.login.mockResolvedValueOnce({ access_token: "fake-jwt-token", token_type: "Bearer" });
    
    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/login`)
      .send(loginDto)
      .expect(HttpStatus.OK);
      
    expect(response.body).toMatchObject({
      access_token: "fake-jwt-token",
      token_type: "Bearer",
    });
  })

  //FIM LOGIN TEST,
});