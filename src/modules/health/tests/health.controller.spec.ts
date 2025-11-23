import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, InternalServerErrorException, Logger, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { HealthController } from '../controller/health.controller';
import { HealthService } from '../service/health.service';
import { after, mock } from 'node:test';

//INICIO CONTROLLER HEALTH
describe('HealthController - get health', () => {
  let app: INestApplication;
  let controller: HealthController;

  const BASE_URL: string = '/api/v1/health';

const mockHealthService = {
  check: jest.fn().mockResolvedValue({ message: 'Ok' }),
};

  beforeAll(() => Logger.overrideLogger(false));
  afterAll(() => Logger.overrideLogger(true));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: mockHealthService }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 200 when API is up', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .expect(HttpStatus.OK);
    
    expect(response.body).toMatchObject({
      message: 'Ok',
    });
  })

  it('should return 500 when API is down', async () => { 
    mockHealthService.check = jest.fn().mockRejectedValue(new InternalServerErrorException('Api is not healthy'));
    
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}`)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    
    expect(response.body).toMatchObject({
      message: 'Api is not healthy',
    });
  })

  //FIM CONTROLLER HEALTH
})