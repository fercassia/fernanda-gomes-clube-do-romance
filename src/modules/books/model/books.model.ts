import { SourceEnum } from "../enum/source.enum";

export class BooksModel {
  private readonly _id: string;
  private readonly _externalId: string;
  private readonly _source: SourceEnum;
  private readonly _title: string;
  private readonly _authors: string[];
  private readonly _selfLink: string | null;
  private readonly _publisher: string | null;
  private readonly _publishedDate: string | null;
  private readonly _pageCount: number | null;
  private readonly _language: string | null;
  private readonly _isbn13: string | null;
  private readonly _isbn10: string | null;
  private readonly _averageRating: number | null;
  private readonly _ratingsCount: number | null;
  private readonly _description: string | null;
  constructor(
    externalId: string,
    source: SourceEnum,
    title: string,
    authors: string[],
    selfLink?: string | null,
    publisher?: string | null,
    publishedDate?: string | null,
    pageCount?: number | null,
    language?: string | null,
    isbn13?: string | null,
    isbn10?: string | null,
    averageRating?: number | null,
    ratingsCount?: number | null,
    description?: string | null
  ) {
    this._externalId = externalId;
    this._source = source;
    this._title = title;
    this._authors = authors ?? [];
    this._selfLink = selfLink ?? null;
    this._publisher = publisher ?? null;
    this._publishedDate = publishedDate ?? null;
    this._pageCount = pageCount ?? null;
    this._language = language ?? null;
    this._isbn13 = isbn13 ?? null;
    this._isbn10 = isbn10 ?? null;
    this._averageRating = averageRating ?? null;
    this._ratingsCount = ratingsCount ?? null;
    this._description = description ?? null;
  }

  get externalId(): string { return this._externalId; }
  get source(): SourceEnum { return this._source; }
  get title(): string { return this._title; }
  get authors(): string[] { return this._authors; }
  get selfLink(): string | null { return this._selfLink; }
  get publisher(): string | null{ return this._publisher; }
  get publishedDate(): string | null { return this._publishedDate; }
  get pageCount(): number | null { return this._pageCount; }
  get language(): string | null { return this._language; }
  get isbn13(): string | null { return this._isbn13; }
  get isbn10(): string | null { return this._isbn10; }
  get averageRating(): number | null { return this._averageRating; }
  get ratingsCount(): number | null { return this._ratingsCount; }
  get description(): string | null { return this._description; }
}