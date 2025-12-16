import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../services/books.service';
import { GoogleBooksApiService } from '../client/googleBooksApi.service';
import { BooksMapper } from '../mapper/books.mapper';
import { BOOKS_REPOSITORY_INTERFACE } from '../interfaces/repository/iBooksRepository.interface';
import { BadRequestException, Logger } from '@nestjs/common';
import { BooksSearchModel } from '../model/booksSearch.model';
import { SourceEnum } from '../enum/source.enum';
import { BooksModel } from '../model/books.model';
import { BooksResponseDto } from '../dto/booksResponse.dto';
import { GoogleBooksApiResponseDto } from '../client/googleBooksApiResponse.dto';
import { BooksEntity } from '../entities/books.entity';

describe('BooksService', () => {
  let service: BooksService;

  const mockRepository = {
    createBooks: jest.fn(),
    findBooksByIsbn: jest.fn(),
    findBooksExternalIdAndSource: jest.fn(),
    findBooksByQuery: jest.fn(),
  };

  const mockGoogleBooksApiService = {
    getBooksGoogleApi: jest.fn(),
  } as Partial<GoogleBooksApiService>;

  beforeAll(() => Logger.overrideLogger(false));
  afterAll(() => Logger.overrideLogger(true));

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BOOKS_REPOSITORY_INTERFACE, useValue: mockRepository },
        { provide: GoogleBooksApiService, useValue: mockGoogleBooksApiService },
        BooksMapper,
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //GET BOOK LOGIN TESTS START

  it('should throw Bad Request if not send query', async () => {
    const querySearchMock = new BooksSearchModel();

    await expect(service.getBooks(querySearchMock)).rejects.toThrow(
      'At least one search parameter must be provided.',
    );
    await expect(service.getBooks(querySearchMock)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw Bad Request if not send query', async () => {
    const querySearchMock = new BooksSearchModel(
      undefined,
      1,
      10,
      'newest',
      'book',
    );

    await expect(service.getBooks(querySearchMock)).rejects.toThrow(
      'At least one search parameter must be provided.',
    );
    await expect(service.getBooks(querySearchMock)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('should retourn books by isbn 13', async () => {
    const model: BooksModel[] = [
      new BooksModel(
        'isbn13Book',
        SourceEnum.GOOGLE_BOOKS_API,
        'Test Book Title',
        ['Author One', 'Author Two'],
        'book',
        'http://example.com/selfLink',
        'Test Publisher',
        '2023-01-01',
        300,
        'en',
        '1234567890123',
        '1234567890',
        4.5,
        100,
        'This is a test book description.',
      ),
    ];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel(
      '1234567890123',
      1,
      10,
      'newest',
      'book',
    );
    mockRepository.findBooksByIsbn.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(
      new BooksMapper().toResponseBooks(bookMapperToEntity),
    );
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith(
      '1234567890123',
    );
  });
  it('should retourn books by isbn 10', async () => {
    const model: BooksModel[] = [
      new BooksModel(
        'isbn13Book',
        SourceEnum.GOOGLE_BOOKS_API,
        'Test Book Title',
        ['Author One', 'Author Two'],
        'book',
        'http://example.com/selfLink',
        'Test Publisher',
        '2023-01-01',
        300,
        'en',
        '1234567890123',
        '1234567890',
        4.5,
        100,
        'This is a test book description.',
      ),
    ];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel(
      '1234567890',
      1,
      10,
      'newest',
      'book',
    );
    mockRepository.findBooksByIsbn.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(
      new BooksMapper().toResponseBooks(bookMapperToEntity),
    );
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith('1234567890');
  });
  it('should retourn books by title - query param', async () => {
    const model: BooksModel[] = [
      new BooksModel(
        'isbn13Book',
        SourceEnum.GOOGLE_BOOKS_API,
        'Test Book Title',
        ['Author One', 'Author Two'],
        'book',
        'http://example.com/selfLink',
        'Test Publisher',
        '2023-01-01',
        300,
        'en',
        '1234567890123',
        '1234567890',
        4.5,
        100,
        'This is a test book description.',
      ),
    ];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel(
      'isbn13Book',
      1,
      10,
      'newest',
      'book',
    );
    mockRepository.findBooksByQuery.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(
      new BooksMapper().toResponseBooks(bookMapperToEntity),
    );
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'isbn13Book',
      'book',
      0,
      10,
      'newest',
    );
  });
  it('should return books by title and default params - with only query param', async () => {
    const model: BooksModel[] = [
      new BooksModel(
        'isbn13Book',
        SourceEnum.GOOGLE_BOOKS_API,
        'Test Book Title',
        ['Author One', 'Author Two'],
        'book',
        'http://example.com/selfLink',
        'Test Publisher',
        '2023-01-01',
        300,
        'en',
        '1234567890123',
        '1234567890',
        4.5,
        100,
        'This is a test book description.',
      ),
      new BooksModel(
        'isbn1Book',
        SourceEnum.GOOGLE_BOOKS_API,
        'Test Book Title',
        ['Author One', 'Author Two'],
        'book',
        'http://example.com/selfLink',
        'Test Publisher',
        '2023-01-01',
        300,
        'en',
        '1234567890123',
        '1234567890',
        4.5,
        100,
        'This is a test book description.',
      ),
      new BooksModel(
        'Book',
        SourceEnum.GOOGLE_BOOKS_API,
        'Test Book Title',
        ['Author isbn1', 'Author Two'],
        'book',
        'http://example.com/selfLink',
        'Test Publisher',
        '2023-01-01',
        300,
        'en',
        '1234567890123',
        '1234567890',
        4.5,
        100,
        'This is a test book description.',
      ),
    ];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel('isbn');
    mockRepository.findBooksByQuery.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(
      new BooksMapper().toResponseBooks(bookMapperToEntity),
    );
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'isbn',
      'book',
      0,
      10,
      'ranking',
    );
  });
  it('shoul return only books with same title when search by query', async () => {
    const booksWithHarry: BooksModel[] = [
      new BooksModel(
        'harry-potter-1',
        SourceEnum.GOOGLE_BOOKS_API,
        "Harry Potter and the Philosopher's Stone",
        ['J.K. Rowling'],
        'book',
        'http://example.com/hp1',
        'Bloomsbury',
        '1997-06-26',
        309,
        'en',
        '9780747532699',
        '0747532699',
        4.8,
        500000,
        "A young wizard's journey",
      ),
      new BooksModel(
        'harry-potter-2',
        SourceEnum.GOOGLE_BOOKS_API,
        'Harry Potter and the Chamber of Secrets',
        ['J.K. Rowling'],
        'book',
        'http://example.com/hp2',
        'Bloomsbury',
        '1998-07-02',
        341,
        'en',
        '9780747538494',
        '0747538492',
        4.7,
        400000,
        "Harry's second year at Hogwarts",
      ),
    ];

    const querySearchMockWithHarry = new BooksSearchModel(
      'harry',
      1,
      10,
      'newest',
      'book',
    );
    const booksMapperToEntity = new BooksMapper().toEntityBooks(booksWithHarry);

    mockRepository.findBooksByQuery.mockResolvedValueOnce(booksWithHarry);
    const result = await service.getBooks(querySearchMockWithHarry);

    expect(result).toEqual(
      new BooksMapper().toResponseBooks(booksMapperToEntity),
    );
    expect(result).toHaveLength(2);
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'harry',
      'book',
      0,
      10,
      'newest',
    );

    const responseBooks = new BooksMapper().toResponseBooks(
      booksMapperToEntity,
    );
    responseBooks.forEach((book) => {
      expect(book.title.toLowerCase()).toContain('harry');
    });
  });
  it('should return only books with author "Rowling" when searching for this author', async () => {
    const booksWithRowling: BooksModel[] = [
      new BooksModel(
        'harry-potter-1',
        SourceEnum.GOOGLE_BOOKS_API,
        "Harry Potter and the Philosopher's Stone",
        ['J.K. Rowling'],
        'book',
        'http://example.com/hp1',
        'Bloomsbury',
        '1997-06-26',
        309,
        'en',
        '9780747532699',
        '0747532699',
        4.8,
        500000,
        "A young wizard's journey",
      ),
    ];

    const querySearchMock = new BooksSearchModel(
      'Rowling',
      1,
      10,
      'newest',
      'book',
    );
    const bookMapperToEntity = new BooksMapper().toEntityBooks(
      booksWithRowling,
    );

    mockRepository.findBooksByQuery.mockResolvedValueOnce(booksWithRowling);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(
      new BooksMapper().toResponseBooks(bookMapperToEntity),
    );
    expect(result).toHaveLength(1);
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'Rowling',
      'book',
      0,
      10,
      'newest',
    );

    const responseBooks = new BooksMapper().toResponseBooks(bookMapperToEntity);
    responseBooks.forEach((book) => {
      const hasRowlingAuthor = book.authors.some((author) =>
        author.toLowerCase().includes('rowling'),
      );
      expect(hasRowlingAuthor).toBe(true);
    });
  });
  it('should return empty array when no books found for given query', async () => {
    const querySearchMock = new BooksSearchModel(
      'NonExistentBookTitle',
      1,
      10,
      'newest',
      'book',
    );
    mockRepository.findBooksByQuery.mockResolvedValueOnce([]);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual([]);
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'NonExistentBookTitle',
      'book',
      0,
      10,
      'newest',
    );
  });

  it('should differentiate between books with and without the search term', async () => {
    const allBooks: BooksModel[] = [
      new BooksModel(
        'harry-potter-1',
        SourceEnum.GOOGLE_BOOKS_API,
        'Harry Potter',
        ['J.K. Rowling'],
        'book',
        'http://example.com/hp1',
        'Bloomsbury',
        '1997-06-26',
        309,
        'en',
        '9780747532699',
        '0747532699',
        4.8,
        500000,
        "A young wizard's journey",
      ),
      new BooksModel(
        'the-hobbit',
        SourceEnum.GOOGLE_BOOKS_API,
        'The Hobbit',
        ['J.R.R. Tolkien'],
        'book',
        'http://example.com/hobbit',
        'Allen & Unwin',
        '1937-09-21',
        310,
        'en',
        '9780547928227',
        '0547928225',
        4.7,
        250000,
        'An adventure in Middle Earth',
      ),
    ];
    const filteredBooks = allBooks.filter((book) =>
      book.title.toLowerCase().includes('hobbit'),
    );

    const querySearchMock = new BooksSearchModel(
      'Hobbit',
      1,
      2,
      'newest',
      'book',
    );
    const bookMapperToEntity = new BooksMapper().toEntityBooks(filteredBooks);

    mockRepository.findBooksByQuery.mockResolvedValueOnce(filteredBooks);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(
      new BooksMapper().toResponseBooks(bookMapperToEntity),
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain('Hobbit');
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'Hobbit',
      'book',
      0,
      2,
      'newest',
    );

    expect(result.map((book) => book.title)).not.toContain('Harry Potter');
  });

  it('should call external api (GOOGLE), save and return result when search by isbn and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '1234567890123',
      1,
      10,
      'newest',
      'book',
    );
    const bookResponse = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const googleItems = new GoogleBooksApiResponseDto([bookResponse]);
    const bookMapperToModel = new BooksMapper().toModelBook(bookResponse);
    const booksMapperToEntityArray = new BooksMapper().toEntityBooks([
      bookMapperToModel,
    ]);
    const booksMapperToResponseArray = new BooksMapper().toResponseBooks(
      booksMapperToEntityArray,
    );

    (mockRepository.findBooksByIsbn as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(booksMapperToEntityArray);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce(null);
    (mockRepository.createBooks as jest.Mock).mockResolvedValueOnce(
      booksMapperToEntityArray,
    );
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith(
      '1234567890123',
    );
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledTimes(2);
    expect(mockRepository.createBooks).toHaveBeenCalledWith(
      booksMapperToEntityArray,
    );
    expect(result).toEqual(booksMapperToResponseArray);
  });

  it('should call external api (GOOGLE) and return empty when search by isbn and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '1234567890123',
      1,
      10,
      'newest',
      'book',
    );
    const googleItems = new GoogleBooksApiResponseDto([]);

    (mockRepository.findBooksByIsbn as jest.Mock).mockResolvedValueOnce(null);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith(
      '1234567890123',
    );
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledTimes(1);
    expect(mockRepository.createBooks).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should call external api (GOOGLE), save de difference and return result when search by isbn and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '1234567890123',
      1,
      10,
      'newest',
      'book',
    );
    const bookResponse = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const bookResponseFound = new BooksResponseDto(
      'g2',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const googleItems = new GoogleBooksApiResponseDto([
      bookResponse,
      bookResponseFound,
    ]);
    const bookMapperToModel = new BooksMapper().toModelBook(bookResponse);
    const booksMapperToEntityArray = new BooksMapper().toEntityBooks([
      bookMapperToModel,
    ]);
    const booksMapperToResponseArray = new BooksMapper().toResponseBooks(
      booksMapperToEntityArray,
    );

    (mockRepository.findBooksByIsbn as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(booksMapperToEntityArray);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce([bookResponseFound]);
    (mockRepository.createBooks as jest.Mock).mockResolvedValueOnce(
      booksMapperToEntityArray,
    );
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith(
      '1234567890123',
    );
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledTimes(2);
    expect(mockRepository.createBooks).toHaveBeenCalledWith(
      booksMapperToEntityArray,
    );
    expect(result).toEqual(booksMapperToResponseArray);
  });

  it('should call external api (GOOGLE), and return empty because have no difference of books already saved when search by isbn and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '1234567890123',
      1,
      10,
      'newest',
      'book',
    );
    const bookResponse = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const bookResponseFound = new BooksResponseDto(
      'g2',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const googleItems = new GoogleBooksApiResponseDto([
      bookResponse,
      bookResponseFound,
    ]);
    const bookMapperToModel = new BooksMapper().toModelBook(bookResponse);
    const booksMapperToEntityArray = new BooksMapper().toEntityBooks([
      bookMapperToModel,
    ]);
    const booksMapperToResponseArray = new BooksMapper().toResponseBooks(
      booksMapperToEntityArray,
    );

    (mockRepository.findBooksByIsbn as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(booksMapperToEntityArray);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce([bookResponseFound, bookResponse]);

    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith(
      '1234567890123',
    );
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledTimes(1);
    expect(mockRepository.createBooks).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should call external api (GOOGLE), save and return result when search by query and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '123Book',
      1,
      10,
      'newest',
      'book',
    );
    const bookResponse = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      '123Book',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const googleItems = new GoogleBooksApiResponseDto([bookResponse]);
    const bookMapperToModel = new BooksMapper().toModelBook(bookResponse);
    const booksMapperToEntityArray = new BooksMapper().toEntityBooks([
      bookMapperToModel,
    ]);
    const booksMapperToResponseArray = new BooksMapper().toResponseBooks(
      booksMapperToEntityArray,
    );

    (mockRepository.findBooksByQuery as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(booksMapperToEntityArray);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce(null);
    (mockRepository.createBooks as jest.Mock).mockResolvedValueOnce(
      booksMapperToEntityArray,
    );
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      '123Book',
      'book',
      0,
      10,
      'newest',
    );
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledTimes(2);
    expect(mockRepository.createBooks).toHaveBeenCalledWith(
      booksMapperToEntityArray,
    );
    expect(result).toEqual(booksMapperToResponseArray);
  });

  it('should call external api (GOOGLE) and return empty when search by query and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '123A',
      1,
      10,
      'newest',
      'book',
    );
    const googleItems = new GoogleBooksApiResponseDto([]);

    (mockRepository.findBooksByQuery as jest.Mock).mockResolvedValueOnce(null);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      '123A',
      'book',
      0,
      10,
      'newest',
    );
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledTimes(1);
    expect(mockRepository.createBooks).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should call external api (GOOGLE), save de difference and return result when search by query and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '123A',
      1,
      10,
      'newest',
      'book',
    );
    const bookResponse = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['123A'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const bookResponseFound = new BooksResponseDto(
      'g2',
      SourceEnum.GOOGLE_BOOKS_API,
      '123A',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const googleItems = new GoogleBooksApiResponseDto([
      bookResponse,
      bookResponseFound,
    ]);
    const bookMapperToModel = new BooksMapper().toModelBook(bookResponse);
    const booksMapperToEntityArray = new BooksMapper().toEntityBooks([
      bookMapperToModel,
    ]);
    const booksMapperToResponseArray = new BooksMapper().toResponseBooks(
      booksMapperToEntityArray,
    );

    (mockRepository.findBooksByQuery as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(booksMapperToEntityArray);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce([bookResponseFound]);
    (mockRepository.createBooks as jest.Mock).mockResolvedValueOnce(
      booksMapperToEntityArray,
    );
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      '123A',
      'book',
      0,
      10,
      'newest',
    );
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledTimes(2);
    expect(mockRepository.createBooks).toHaveBeenCalledWith(
      booksMapperToEntityArray,
    );
    expect(result).toEqual(booksMapperToResponseArray);
  });
  it('should call external api (GOOGLE), save and return empty result when search by isbn and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      '1234567890123',
      1,
      10,
      'newest',
      'book',
    );
    const bookResponse = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const googleItems = new GoogleBooksApiResponseDto([bookResponse]);
    const bookMapperToModel = new BooksMapper().toModelBook(bookResponse);
    const booksMapperToEntityArray = new BooksMapper().toEntityBooks([
      bookMapperToModel,
    ]);
    // response mapping não é necessário pois esperamos []

    (mockRepository.findBooksByIsbn as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce(null);
    (mockRepository.createBooks as jest.Mock).mockResolvedValueOnce(
      booksMapperToEntityArray,
    );
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith(
      '1234567890123',
    );
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledTimes(2);
    expect(mockRepository.createBooks).toHaveBeenCalledWith(
      booksMapperToEntityArray,
    );
    expect(result).toEqual([]);
  });
  it('should call external api (GOOGLE), save and return empty result when search by query and not found in data base', async () => {
    const querySearchMock = new BooksSearchModel(
      'Book',
      1,
      2,
      'newest',
      'book',
    );
    const bookResponse = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      'New Book from API',
      ['API Author'],
      'book',
      'http://example.com/apiBook',
      'API Publisher',
      '2023-01-01',
      250,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      50,
      'Book fetched from external API.',
    );
    const googleItems = new GoogleBooksApiResponseDto([bookResponse]);
    const bookMapperToModel = new BooksMapper().toModelBook(bookResponse);
    const booksMapperToEntityArray = new BooksMapper().toEntityBooks([
      bookMapperToModel,
    ]);
    // response mapping não é necessário pois esperamos []

    (mockRepository.findBooksByQuery as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce(null);
    (mockRepository.createBooks as jest.Mock).mockResolvedValueOnce(
      booksMapperToEntityArray,
    );
    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'Book',
      'book',
      0,
      2,
      'newest',
    );
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledTimes(2);
    expect(mockRepository.createBooks).toHaveBeenCalledWith(
      booksMapperToEntityArray,
    );
    expect(result).toEqual([]);
  });

  it('should call external api (GOOGLE), return empty because there books already exist in the database when searching by query', async () => {
    const querySearchMock = new BooksSearchModel(
      'QueryNoDiff',
      1,
      10,
      'newest',
      'book',
    );
    const bookResponse1 = new BooksResponseDto(
      'g1',
      SourceEnum.GOOGLE_BOOKS_API,
      'QueryNoDiff',
      ['Author One'],
      'book',
      'http://example.com/book1',
      'Publisher',
      '2023-01-01',
      100,
      'en',
      '1234567890123',
      '1234567890',
      4.0,
      10,
      'Desc',
    );
    const bookResponse2 = new BooksResponseDto(
      'g2',
      SourceEnum.GOOGLE_BOOKS_API,
      'QueryNoDiff 2',
      ['Author Two'],
      'book',
      'http://example.com/book2',
      'Publisher',
      '2023-01-01',
      120,
      'en',
      '9876543210123',
      '9876543210',
      4.5,
      20,
      'Desc 2',
    );

    const googleItems = new GoogleBooksApiResponseDto([
      bookResponse1,
      bookResponse2,
    ]);

    (mockRepository.findBooksByQuery as jest.Mock).mockResolvedValueOnce(null);
    (
      mockGoogleBooksApiService.getBooksGoogleApi as jest.Mock
    ).mockResolvedValueOnce(googleItems);
    (
      mockRepository.findBooksExternalIdAndSource as jest.Mock
    ).mockResolvedValueOnce([bookResponse1, bookResponse2]);

    const result = await service.getBooks(querySearchMock);

    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith(
      'QueryNoDiff',
      'book',
      0,
      10,
      'newest',
    );
    expect(mockRepository.createBooks).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
