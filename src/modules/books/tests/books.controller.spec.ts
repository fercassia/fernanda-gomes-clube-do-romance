import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../controllers/books.controller';
import { BooksService } from '../services/books.service';
import { BooksMapper } from '../mapper/books.mapper';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  InternalServerErrorException,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { AllExceptionsFilter } from '../../../error/AllExceptionsFilter';
import request from 'supertest';
import 'reflect-metadata';
import { In } from 'typeorm';

describe('BooksController', () => {
  let app: INestApplication;
  let controller: BooksController;
  const BASE_URL: string = '/api/v1/books';

  const mockBooksService: Partial<BooksService> = {
    getBooks: jest.fn(),
  };

  const mockMapper: Partial<BooksMapper> = {
    toBooksSearchModel: jest.fn(),
  };

  beforeAll(() => {
    Logger.overrideLogger(false);
  });

  afterAll(() => {
    Logger.overrideLogger(true);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: BooksMapper, useValue: mockMapper },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => {
          const resultErrors = errors.map((er) => ({
            property: er.property,
            errorMessage: Object.values(er.constraints || {}).join(', '),
          }));
          return new BadRequestException({
            message: 'Validation error',
            errors: resultErrors,
          });
        },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 200 when do not provide a pameter', async () => {
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=`)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(mockBooksService.getBooks).toHaveBeenCalled();
  });

  it('should return 200 and books', async () => {
    const booksMooks = [
      {
        _externalId: 'ext-1',
        _source: 'GOOGLE_BOOKS_API',
        _title: 'Delilah',
        _authors: ['Author 1'],
        _type: 'book',
        _selfLink: 'https://example.com/books/ext-1',
        _publisher: 'Publisher 1',
        _publishedDate: '2020-01-01',
        _pageCount: 123,
        _language: 'en',
        _isbn13: '9780000000001',
        _isbn10: '0000000001',
        _averageRating: 4.5,
        _ratingsCount: 100,
        _description: 'Desc 1',
      },
      {
        _externalId: 'ext-2',
        _source: 'GOOGLE_BOOKS_API',
        _title: 'Another Book',
        _authors: ['Delilah 1'],
        _type: 'book',
        _selfLink: 'https://example.com/books/ext-2',
        _publisher: 'Publisher 2',
        _publishedDate: '2021-02-02',
        _pageCount: 234,
        _language: 'en',
        _isbn13: '9780000000002',
        _isbn10: '0000000002',
        _averageRating: 4.0,
        _ratingsCount: 50,
        _description: 'Desc 2',
      },
    ];
    mockBooksService.getBooks = jest.fn().mockResolvedValue(booksMooks);
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah`)
      .expect(HttpStatus.OK);

    expect(mockBooksService.getBooks).toHaveBeenCalled();
    expect(response.body).toEqual(booksMooks);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((book) => book._externalId)).toEqual(['ext-1', 'ext-2']);
  });
  it('should return 200 and books empty', async () => {
    const booksMooks = [];
    mockBooksService.getBooks = jest.fn().mockResolvedValue(booksMooks);
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah`)
      .expect(HttpStatus.OK);

    expect(mockBooksService.getBooks).toHaveBeenCalled();
    expect(response.body).toEqual(booksMooks);
    expect(response.body).toHaveLength(0);
  });
  it('should return 400 when send page lower than 1', async () => {
    const constResult = {
      cause: {
        errorText: {
          errors: [
            {
              errorMessage:
                'page must be a positive number, page must not be less than 1',
              property: 'page',
            },
          ],
          message: 'Validation error',
        },
        status: 400,
      },
      path: '/api/v1/books?query=delilah&page=0',
    };
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&page=0`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(mockBooksService.getBooks).not.toHaveBeenCalled();
    expect(response.body).toEqual(constResult);
  });
  it('should return 400 when send page as negative number', async () => {
    const constResult = {
      cause: {
        errorText: {
          errors: [
            {
              errorMessage:
                'page must be a positive number, page must not be less than 1',
              property: 'page',
            },
          ],
          message: 'Validation error',
        },
        status: 400,
      },
      path: '/api/v1/books?query=delilah&page=-10',
    };
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&page=-10`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(mockBooksService.getBooks).not.toHaveBeenCalled();
    expect(response.body).toEqual(constResult);
  });
  it('should return 400 when send limit lower than 1', async () => {
    const constResult = {
      cause: {
        errorText: {
          errors: [
            {
              errorMessage:
                'limit must be a positive number, limit must not be less than 1',
              property: 'limit',
            },
          ],
          message: 'Validation error',
        },
        status: 400,
      },
      path: '/api/v1/books?query=delilah&limit=0',
    };
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&limit=0`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(mockBooksService.getBooks).not.toHaveBeenCalled();
    expect(response.body).toEqual(constResult);
  });
  it('should return 400 when send limit greather then 40', async () => {
    const constResult = {
      cause: {
        errorText: {
          errors: [
            {
              errorMessage: 'limit must not be greater than 40',
              property: 'limit',
            },
          ],
          message: 'Validation error',
        },
        status: 400,
      },
      path: '/api/v1/books?query=delilah&limit=41',
    };
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&limit=41`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(mockBooksService.getBooks).not.toHaveBeenCalled();
    expect(response.body).toEqual(constResult);
  });
  it('should return 400 when send filter unknown', async () => {
    const constResult = {
      cause: {
        errorText: {
          errors: [
            {
              errorMessage:
                'filter must be one of the following values: newest, ranking',
              property: 'filter',
            },
          ],
          message: 'Validation error',
        },
        status: 400,
      },
      path: '/api/v1/books?query=delilah&filter=newester',
    };
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&filter=newester`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(mockBooksService.getBooks).not.toHaveBeenCalled();
    expect(response.body).toEqual(constResult);
  });
  it('should return 400 when send type unknown', async () => {
    const constResult = {
      cause: {
        errorText: {
          errors: [
            {
              errorMessage:
                'type must be one of the following values: magazine, book',
              property: 'type',
            },
          ],
          message: 'Validation error',
        },
        status: 400,
      },
      path: '/api/v1/books?query=delilah&type=magazin',
    };
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&type=magazin`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(mockBooksService.getBooks).not.toHaveBeenCalled();
    expect(response.body).toEqual(constResult);
  });
  it('should return 400 when send a parameter unknown', async () => {
    const constResult = {
      cause: {
        errorText: {
          errors: [
            {
              errorMessage:
                'property ty should not exist',
              property: 'ty',
            },
          ],
          message: 'Validation error',
        },
        status: 400,
      },
      path: '/api/v1/books?query=delilah&ty=magazin',
    };
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&ty=magazin`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(mockBooksService.getBooks).not.toHaveBeenCalled();
    expect(response.body).toEqual(constResult);
  });

  it('should call mapper with transformed dto and pass its result to service', async () => {
    const searchModelMock = {
      query: 'delilah',
      page: 2,
      limit: 5,
      filter: 'newest',
      type: 'book',
    };

    (mockMapper.toBooksSearchModel as jest.Mock) = jest
      .fn()
      .mockReturnValue(searchModelMock);
    (mockBooksService.getBooks as jest.Mock) = jest.fn().mockResolvedValue([]);
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&page=2&limit=5&filter=newest&type=book`)
      .expect(HttpStatus.OK);

    expect(mockMapper.toBooksSearchModel).toHaveBeenCalledTimes(1);
    const mapperArg = (mockMapper.toBooksSearchModel as jest.Mock).mock.calls[0][0];

    expect(mapperArg).toEqual(searchModelMock);

    expect(typeof mapperArg.page).toBe('number');
    expect(typeof mapperArg.limit).toBe('number');

    const mapperOrder = (mockMapper.toBooksSearchModel as jest.Mock).mock.invocationCallOrder[0];
    const serviceOrder = (mockBooksService.getBooks as jest.Mock).mock.invocationCallOrder[0];
    
    expect(mapperOrder).toBeLessThan(serviceOrder);
    expect(mockBooksService.getBooks).toHaveBeenCalledWith(mapperArg);
    expect(response.body).toEqual([]);
  });
  it('should return 200 mapper with parameter filter as newest and type book', async () => {
    const searchModelMock = {
      query: 'delilah',
      page: 2,
      limit: 5,
      filter: 'newest',
      type: 'book',
    };

    (mockMapper.toBooksSearchModel as jest.Mock) = jest
      .fn()
      .mockReturnValue(searchModelMock);
    (mockBooksService.getBooks as jest.Mock) = jest.fn().mockResolvedValue([]);
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&page=2&limit=5&filter=newest&type=book`)
      .expect(HttpStatus.OK);

    expect(mockMapper.toBooksSearchModel).toHaveBeenCalledTimes(1);
    const mapperArg = (mockMapper.toBooksSearchModel as jest.Mock).mock.calls[0][0];

    expect(mockBooksService.getBooks).toHaveBeenCalledWith(mapperArg);
    expect(response.body).toEqual([]);
  });
  it('should return 200 mapper with parameter filter as ranking and type magazine', async () => {
    const searchModelMock = {
      query: 'delilah',
      page: 1,
      limit: 10,
      filter: 'ranking',
      type: 'magazine',
    };
    const booksMocks = [
      {
        _externalId: 'ext-1',
        _source: 'GOOGLE_BOOKS_API',
        _title: 'Delilah',
        _authors: ['Author 1'],
        _type: 'magazine',
        _selfLink: 'https://example.com/books/ext-1',
        _publisher: 'Publisher 1',
        _publishedDate: '2020-01-01',
        _pageCount: 123,
        _language: 'en',
        _isbn13: null,
        _isbn10: '0000000001',
        _averageRating: 4.5,
        _ratingsCount: null,
        _description: 'Desc 1',
      },
    ];

    (mockMapper.toBooksSearchModel as jest.Mock) = jest
      .fn()
      .mockReturnValue(searchModelMock);
    (mockBooksService.getBooks as jest.Mock) = jest.fn().mockResolvedValue(booksMocks);
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&page=1&limit=10&filter=ranking&type=magazine`)
      .expect(HttpStatus.OK);

    expect(mockMapper.toBooksSearchModel).toHaveBeenCalledTimes(1);
    const mapperArg = (mockMapper.toBooksSearchModel as jest.Mock).mock.calls[0][0];
    
    expect(mockBooksService.getBooks).toHaveBeenCalledWith(mapperArg);
    expect(response.body).toEqual(booksMocks);
  });

  it('should return 500 when service throws a internal error', async () => {
    const searchModelMock = {
      query: 'delilah',
      page: 2,
      limit: 5,
      filter: 'newest',
      type: 'book',
    };

    const constResult = {
      cause: {
        errorText: {
          message: 'Internal Server Error',
          statusCode: 500,
        },
        status: 500,
      },
      path: '/api/v1/books?query=delilah&page=2&limit=5&filter=newest&type=book',
    };
    
    (mockMapper.toBooksSearchModel as jest.Mock) = jest
      .fn()
      .mockReturnValue(searchModelMock);
    (mockBooksService.getBooks as jest.Mock) = jest.fn().mockRejectedValue(new InternalServerErrorException());
    const response = await request(app.getHttpServer())
      .get(`${BASE_URL}?query=delilah&page=2&limit=5&filter=newest&type=book`)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(mockMapper.toBooksSearchModel).toHaveBeenCalledTimes(1);
    const mapperArg = (mockMapper.toBooksSearchModel as jest.Mock).mock.calls[0][0];

    expect(mockBooksService.getBooks).toHaveBeenCalledWith(mapperArg);
    expect(response.body).toEqual(constResult);
  });
});
