import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../services/books.service';
import { GoogleBooksApiService } from '../client/googleBooksApi.service';
import { BooksMapper } from '../mapper/books.mapper';
import { BOOKS_REPOSITORY_INTERFACE } from '../interfaces/repository/iBooksRepository.interface';
import { BadRequestException, Logger } from '@nestjs/common';
import { BooksSearchModel } from '../model/booksSearch.model';
import { mock } from 'node:test';
import { SourceEnum } from '../enum/source.enum';
import { BooksModel } from '../model/books.model';

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BOOKS_REPOSITORY_INTERFACE, useValue: mockRepository },
        { provide: GoogleBooksApiService, useValue: mockGoogleBooksApiService },
        BooksMapper
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //GET BOOK LOGIN TESTS START
  
  it('should throw Bad Request if not send query', async () => {
    const querySearchMock = new BooksSearchModel(undefined, 1, 10, 'newest', 'book')
    
    await expect(service.getBooks(querySearchMock)).rejects.toThrow('At least one search parameter must be provided.');
    await expect(service.getBooks(querySearchMock)).rejects.toThrow(BadRequestException);
  });

  //retorno com isbn 13
  // retorno isbn 10
  // retorno query
  it('should retourn books by isbn 13', async () => {
    const model: BooksModel[] = [new BooksModel(
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
      'This is a test book description.'
    )];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel('1234567890123', 1, 10, 'newest', 'book');
    mockRepository.findBooksByIsbn.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(new BooksMapper().toResponseBooks(bookMapperToEntity));
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith('1234567890123');
  });
  it('should retourn books by isbn 10', async () => {
    const model: BooksModel[] = [new BooksModel(
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
      'This is a test book description.'
    )];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel('1234567890', 1, 10, 'newest', 'book');
    mockRepository.findBooksByIsbn.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(new BooksMapper().toResponseBooks(bookMapperToEntity));
    expect(mockRepository.findBooksByIsbn).toHaveBeenCalledWith('1234567890');
  });
  it('should retourn books by title - query param', async () => {
    const model: BooksModel[] = [new BooksModel(
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
      'This is a test book description.'
    )];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel('isbn13Book', 1, 10, 'newest', 'book');
    mockRepository.findBooksByQuery.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(new BooksMapper().toResponseBooks(bookMapperToEntity));
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith("isbn13Book", "book", 0, 10, "newest");
  });
  it('should return books by title and default params - with only query param', async () => {
    const model: BooksModel[] = [new BooksModel(
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
      'This is a test book description.'
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
      'This is a test book description.'
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
      'This is a test book description.'
    )
  ];
    const bookMapperToEntity = new BooksMapper().toEntityBooks(model);
    const querySearchMock = new BooksSearchModel('isbn');
    mockRepository.findBooksByQuery.mockResolvedValueOnce(model);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(new BooksMapper().toResponseBooks(bookMapperToEntity));
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith("isbn", "book", 0, 10, "ranking");
  });
  it('shoul return only books with same title when search by query', async () => {
    const booksWithHarry: BooksModel[] = [
      new BooksModel(
        'harry-potter-1',
        SourceEnum.GOOGLE_BOOKS_API,
        'Harry Potter and the Philosopher\'s Stone',
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
        'A young wizard\'s journey'
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
        'Harry\'s second year at Hogwarts'
      )
    ];

    const querySearchMockWithHarry = new BooksSearchModel('harry', 1, 10, 'newest', 'book');
    const booksMapperToEntity = new BooksMapper().toEntityBooks(booksWithHarry);

    mockRepository.findBooksByQuery.mockResolvedValueOnce(booksWithHarry);
    const result = await service.getBooks(querySearchMockWithHarry);

    expect(result).toEqual(new BooksMapper().toResponseBooks(booksMapperToEntity));
    expect(result).toHaveLength(2);
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith('harry', 'book', 0, 10, 'newest');

    const responseBooks = new BooksMapper().toResponseBooks(booksMapperToEntity);
    responseBooks.forEach(book => {
      expect(book.title.toLowerCase()).toContain('harry');
    });
  });
  it('should return only books with author "Rowling" when searching for this author', async () => {
    const booksWithRowling: BooksModel[] = [
      new BooksModel(
        'harry-potter-1',
        SourceEnum.GOOGLE_BOOKS_API,
        'Harry Potter and the Philosopher\'s Stone',
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
        'A young wizard\'s journey'
      )
    ];

    const querySearchMock = new BooksSearchModel('Rowling', 1, 10, 'newest', 'book');
    const bookMapperToEntity = new BooksMapper().toEntityBooks(booksWithRowling);

    mockRepository.findBooksByQuery.mockResolvedValueOnce(booksWithRowling);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(new BooksMapper().toResponseBooks(bookMapperToEntity));
    expect(result).toHaveLength(1);
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith('Rowling', 'book', 0, 10, 'newest');
    
    const responseBooks = new BooksMapper().toResponseBooks(bookMapperToEntity);
    responseBooks.forEach(book => {
      const hasRowlingAuthor = book.authors.some(author => 
        author.toLowerCase().includes('rowling')
      );
      expect(hasRowlingAuthor).toBe(true);
    });
  });
  it('should return empty array when no books found for given query', async () => {
    const querySearchMock = new BooksSearchModel('NonExistentBookTitle', 1, 10, 'newest', 'book');
    mockRepository.findBooksByQuery.mockResolvedValueOnce([]);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual([]);
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith('NonExistentBookTitle', 'book', 0, 10, 'newest');
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
        'A young wizard\'s journey'
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
        'An adventure in Middle Earth'
      )
    ];
    const filteredBooks = allBooks.filter(book => 
      book.title.toLowerCase().includes('hobbit')
    );

    const querySearchMock = new BooksSearchModel('Hobbit', 1, 2, 'newest', 'book');
    const bookMapperToEntity = new BooksMapper().toEntityBooks(filteredBooks);
    
    mockRepository.findBooksByQuery.mockResolvedValueOnce(filteredBooks);
    const result = await service.getBooks(querySearchMock);

    expect(result).toEqual(new BooksMapper().toResponseBooks(bookMapperToEntity));
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain('Hobbit');
    expect(mockRepository.findBooksByQuery).toHaveBeenCalledWith('Hobbit', 'book', 0, 2, 'newest');

    expect(result.map(book => book.title)).not.toContain('Harry Potter');
  });
});
