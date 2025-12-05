
type BookType = 'magazine' | 'book';
type FilterType = 'newest' | 'ranking';

export class BooksSearchModel {
  private readonly _query: string | null;
  private readonly _page: number | null;
  private readonly _limit: number | null;
  private readonly _filter: FilterType | null;
  private readonly _type: BookType | null;

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    filter?: FilterType,
    type?: BookType,
  ) {
    this._query = query ?? null;
    this._page = page ?? null;
    this._limit = limit ?? null;
    this._filter = filter ?? null;
    this._type = type ?? null;
  }

  get query(): string | null {
    return this._query;
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