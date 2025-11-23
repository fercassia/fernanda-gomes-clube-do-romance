import { InternalServerErrorException, Logger } from "@nestjs/common";
import { HealthService } from "../service/health.service";
import { Test, TestingModule } from "@nestjs/testing";
import { DataSource, In } from "typeorm";
import { HealthMapper } from "../mapper/health.mapper";

describe('Health Service', () => {

  let service: HealthService;

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeAll(() => Logger.overrideLogger(false));
  afterAll(() => Logger.overrideLogger(true));

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        }
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

//HEALTH TESTS START

  it('should throw Internal Server Error when query return empty array', async () => {
    mockDataSource.query.mockResolvedValueOnce([]);
    const mapper = jest.spyOn(HealthMapper, 'toResponse');

    await expect(service.check()).rejects.toBeInstanceOf(InternalServerErrorException);
    expect(mapper).not.toHaveBeenCalled();
  });

  it('should treat as empty array when return undefined and throw Internal Server Error', async () => {
    mockDataSource.query.mockResolvedValueOnce(undefined);
    const mapper = jest.spyOn(HealthMapper, 'toResponse');

    await expect(service.check()).rejects.toBeInstanceOf(InternalServerErrorException);
    expect(mapper).not.toHaveBeenCalled();
  });

  it('should return ok when query returns valid data', async () => {
    mockDataSource.query.mockResolvedValueOnce([{ alive: '1' }]);
    const mapper = jest.spyOn(HealthMapper, 'toResponse').mockReturnValueOnce({ message: 'Api is healthy' });

    await expect(service.check()).resolves.toEqual({ message: 'Api is healthy' });
    expect(mapper).toHaveBeenCalledTimes(1);});
});