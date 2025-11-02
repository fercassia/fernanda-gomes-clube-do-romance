import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { USERS_REPOSITORY_INTERFACE } from '../interfaces/repository/iUsersRepository.interface';
import { BadRequestException, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AllExceptionsFilter } from '../../../error/AllExceptionsFilter';

//INICIO CREATE USERS
describe('UsersController - Create Users Controller', () => {
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
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
              errorMessage: 'Password must be at least 8 characters long'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when password has more then 20 characters', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'testuser@example.com',
      password: 'Shot12@12345678901234567890'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

     expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
              errorMessage: 'Password must be at most 20 characters long'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when password does not contain a number', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'testuser@example.com',
      password: 'Shot@PasswordPasses'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

 expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
               errorMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (@$!%*?&)'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when password does not contain a especial character', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'testuser@example.com',
      password: 'Shot23PasswordPasses'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

  expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
               errorMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (@$!%*?&)'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when password does not contain a uppercase letter', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'testuser@example.com',
      password: 'shot2@3passwordpasso'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

     expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
               errorMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (@$!%*?&)'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when password does not contain a lowercase letter', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'testuser@example.com',
      password: 'SHOT2@3PASSWORD'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

     expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
               errorMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (@$!%*?&)'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

    it('should return 400 when password does contain special character not allowed', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'testuser@example.com',
      password: 'SHOT23Password/@'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'password',
               errorMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (@$!%*?&)'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when email does not contain minimum of character', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'tr@e.com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'email',
              errorMessage: 'Invalid email. Valid email: johndoe@example.com'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when email does not contain a correct format', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'tr3@e4com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'email',
              errorMessage: 'Invalid email. Valid email: johndoe@example.com, Invalid email format.'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })
  it('should return 400 when email does not contain a correct format 2-without @', async () => {
    const createUserDto = {
      displayName: 'testuser',
      email: 'tr3out.com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'email',
              errorMessage: 'Invalid email. Valid email: johndoe@example.com, Invalid email format.'
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })

  it('should return 400 when displayname does have invalid characters', async () => {
    const createUserDto = {
      displayName: 'test@user',
      email: 'tr3@out.com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'displayName',
              errorMessage: 'display name can only contain letters, numbers, underscores and hyphens',
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })
  it('should return 400 when displayname does not have minimum length', async () => {
    const createUserDto = {
      displayName: 'te',
      email: 'tr3@out.com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'displayName',
              errorMessage: 'Display name must be at least 3 characters long',
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })
  it('should return 400 when displayname does have more than maximum length', async () => {
    const createUserDto = {
      displayName: 'testuser1234567890testuser1234567890testuser1234567890testuser12345678_',
      email: 'tr3@out.com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      path: "/api/v1/users/register",
      cause: {
        status: 400,
        errorText: {
          message: "Validation error",
          errors: [
            {
              property: 'displayName',
              errorMessage: 'Display name must be at most 70 characters long',
            }
          ]
        }
      }
    });
    expect(mockUsersServices.create).not.toHaveBeenCalled();
  })
  it('should return 201 when the user is correct-1', async () => {
    const createUserDto = {
      displayName: 'testuser12345_-',
      email: 'tr3@out.com',
      password: 'SHOT2@3Password'
    }

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({
      message: 'User created successfully.',
    });
    expect(mockUsersServices.create).toHaveBeenCalled();
  })

  it('should return 201 when the user is correct-2', async () => {
    const createUserDto = {
      displayName: 'testuser12345_-',
      email: 'tr3@out.com',
      password: 'SHOT2@3Password'
    }

    mockUsersServices.create.mockResolvedValueOnce({
      id: 'uuid-v4-test',
      displayName: createUserDto.displayName,
      email: createUserDto.email,
    });

    const response = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({
      message: 'User created successfully.',
    });
    expect(mockUsersServices.create).toHaveBeenCalled();
  })
  //FIM CREATE USER TESTS
});