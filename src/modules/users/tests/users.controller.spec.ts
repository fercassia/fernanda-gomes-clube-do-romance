import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../users/controllers/users.controller';
import { UsersService } from '../services/users.service';
import { USERS_REPOSITORY_INTERFACE } from '../interfaces/repository/iUsersRepository.interface';
import { BadRequestException, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

describe('UsersController', () => {
  let app: INestApplication;
  let controller: UsersController;
  let service: UsersService;

  const BASE_URL: string = '/api/v1/users';

  const mockUsersRepository = {
    create: jest.fn(),
  };

  const mockUsersServices = {
    create: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: USERS_REPOSITORY_INTERFACE,
          useValue: mockUsersRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersServices,
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 when password has less then 8 characters', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'testuser@example.com',
      password: 'Shot12@'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);
    
    expect(response.body).toMatchObject({
      message: 'Validation error',
      errors: [
        {
          property: 'password',
          errorMessage: 'Password must be at least 8 characters long'
        }
      ]
    });
  })
});