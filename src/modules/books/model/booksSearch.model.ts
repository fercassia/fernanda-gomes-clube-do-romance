import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT_FILTER,
} from '../../../utils/constants/searchConstants';
import type { BookType, FilterType } from '../../../utils/types/searchTypes';

export class BooksSearchModel {
  private readonly _query: string | null;
  private _page: number;
  private _limit: number;
  private _filter: FilterType;
  private _type: BookType;

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    filter?: FilterType,
    type?: BookType,
  ) {
    this._query = query?.trim() ?? null;
    this.setPage(page);
    this.setLimit(limit);
    this.setFilter(filter);
    this.setType(type);
  }

  get query(): string | null {
    return this._query;
  }

  get page(): number {
    return this._page;
  }

  private setPage(value?: number) {
    const pageNumber = value ?? DEFAULT_PAGE;
    this._page = pageNumber;
  }

  get limit(): number {
    return this._limit;
  }

  private setLimit(value?: number) {
    const limitNumber = value ?? DEFAULT_LIMIT_FILTER;
    this._limit = limitNumber;
  }

  get filter(): FilterType {
    return this._filter;
  }

  private setFilter(value?: FilterType) {
    const isValidFilter = value ?? 'ranking';
    this._filter = isValidFilter;
  }

  get type(): BookType {
    return this._type;
  }

  private setType(value?: BookType) {
    const isValidType = value ?? 'book';
    this._type = isValidType;
  }
}
