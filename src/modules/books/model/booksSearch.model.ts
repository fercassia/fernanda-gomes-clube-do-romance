
type BookType = 'magazine' | 'book';
type FilterType = 'newest' | 'ranking';

export class BooksSearchModel {
  private readonly _title: string | null;
  private readonly _author: string | null;
  private readonly _category: string | null;
  private readonly _page: number | null;
  private readonly _limit: number | null;
  private readonly _filter: FilterType | null;
  private readonly _type: BookType | null;

  constructor(
    title?: string,
    author?: string,
    category?: string,
    page?: number,
    limit?: number,
    filter?: FilterType,
    type?: BookType,
  ) {
    this._title = title ?? null;
    this._author = author ?? null;
    this._category = category ?? null;
    this._page = page ?? null;
    this._limit = limit ?? null;
    this._filter = filter ?? null;
    this._type = type ?? null;
  }

  get title(): string | null {
    return this._title;
  }

  get author(): string | null {
    return this._author;
  }

  get category(): string | null {
    return this._category;
  }

    get page(): number | null {
    return this._page;
  }

  get limit(): number | null {
    return this._limit;
  }

  get filter(): FilterType | null {
    return this._filter;
  }

  get type(): BookType | null {
    return this._type;
  }
}