export class BooksResponseDto {
  private readonly _externalId: string;
  private readonly _title: string;
  private readonly _authors: string[];
  private readonly _publisher: string;
  private readonly _publishedDate: string;
  private readonly _pageCount: number;
  private readonly _categories: string[];
  private readonly _language: string;
  private readonly _isbn13: string | null;
  private readonly _isbn10: string | null;
  private readonly _averageRating: number | null;
  private readonly _ratingsCount: number | null;
  private readonly _description: string | null;
  private readonly _textSnippet: string | null;
  constructor(
    externalId: string,
    title: string,
    authors: string[],
    publisher: string,
    publishedDate: string,
    pageCount: number,
    categories: string[],
    language: string,
    isbn13: string | null,
    isbn10: string | null,
    averageRating: number | null,
    ratingsCount: number | null,
    description: string | null,
    textSnippet: string | null
  ) {
    this._externalId = externalId;
    this._title = title;
    this._authors = authors;
    this._publisher = publisher;
    this._publishedDate = publishedDate;
    this._pageCount = pageCount;
    this._categories = categories;
    this._language = language;
    this._isbn13 = isbn13 ?? null;
    this._isbn10 = isbn10 ?? null;
    this._averageRating = averageRating ?? null;
    this._ratingsCount = ratingsCount ?? null;
    this._description = description ?? null;
    this._textSnippet = textSnippet ?? null;
  }

    get externalId(): string {
    return this._externalId;
  }

  get title(): string {
    return this._title;
  }

  get authors(): string[] {
    return this._authors;
  }

  get publisher(): string {
    return this._publisher;
  }

  get publishedDate(): string {
    return this._publishedDate;
  }

  get pageCount(): number {
    return this._pageCount;
  }

  get categories(): string[] {
    return this._categories;
  }

  get language(): string {
    return this._language;
  }

  get isbn13(): string | null {
    return this._isbn13;
  }

  get isbn10(): string | null {
    return this._isbn10;
  }

  get averageRating(): number | null {
    return this._averageRating;
  }

  get ratingsCount(): number | null {
    return this._ratingsCount;
  }

  get description(): string | null {
    return this._description;
  }

  get textSnippet(): string | null {
    return this._textSnippet;
  }
}
