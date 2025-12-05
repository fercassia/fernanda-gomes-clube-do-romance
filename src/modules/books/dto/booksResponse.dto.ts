import { SourceEnum } from "../enum/source.enum";
import { ApiProperty } from "@nestjs/swagger";

export class BooksResponseDto {
  @ApiProperty({
    description: "External ID from the provider",
    example: "zyTCAlFPjgYC",
    readOnly: true,
  })
  public readonly _externalId: string;

  @ApiProperty({
    description: "Data source/provider",
    enum: SourceEnum,
    example: SourceEnum.GOOGLE_BOOKS_API,
    readOnly: true,
  })
  public readonly _source: SourceEnum;

  @ApiProperty({
    description: "Book title",
    example: "Pride and Prejudice",
    readOnly: true,
  })
  public readonly _title: string;

  @ApiProperty({
    description: "List of authors",
    example: ["Jane Austen"],
    isArray: true,
    readOnly: true,
  })
  public readonly _authors: string[];

  @ApiProperty({
    description: "Link to the external API resource",
    example: "https://www.googleapis.com/books/v1/volumes/zyTCAlFPjgYC",
    readOnly: true,
  })
  public readonly _selfLink: string | null;

  @ApiProperty({
    description: "Publisher",
    example: "Penguin Classics",
    readOnly: true,
  })
  public readonly _publisher: string | null;

  @ApiProperty({
    description: "Publication date (YYYY-MM-DD or YYYY)",
    example: "2002-05-01",
    readOnly: true,
  })
  public readonly _publishedDate: string | null;

  @ApiProperty({
    description: "Number of pages",
    example: 432,
    readOnly: true,
  })
  public readonly _pageCount: number | null;

  @ApiProperty({
    description: "Language (ISO 639-1 or 639-2)",
    example: "en",
    readOnly: true,
  })
  public readonly _language: string | null;

  @ApiProperty({
    description: "ISBN-13",
    example: "9780141439518",
    nullable: true,
    readOnly: true,
  })
  public readonly _isbn13: string | null;

  @ApiProperty({
    description: "ISBN-10",
    example: "0141439513",
    nullable: true,
    readOnly: true,
  })
  public readonly _isbn10: string | null;

  @ApiProperty({
    description: "Average rating",
    example: 4.3,
    nullable: true,
    readOnly: true,
  })
  public readonly _averageRating: number | null;

  @ApiProperty({
    description: "Ratings count",
    example: 1250,
    nullable: true,
    readOnly: true,
  })
  public readonly _ratingsCount: number | null;

  @ApiProperty({
    description: "Book description/synopsis",
    example: "A classic of English literature...",
    nullable: true,
    readOnly: true,
  })
  public readonly _description: string | null;

  constructor(
    externalId: string,
    source: SourceEnum,
    title: string,
    authors: string[],
    selfLink: string | null,
    publisher: string | null,
    publishedDate: string | null,
    pageCount: number | null,
    language: string | null,
    isbn13: string | null,
    isbn10: string | null,
    averageRating: number | null,
    ratingsCount: number | null,
    description: string | null,
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

  get externalId(): string {
    return this._externalId;
  }
  get source(): SourceEnum {
    return this._source;
  }
  get title(): string {
    return this._title;
  }
  get authors(): string[] {
    return this._authors;
  }
  get selfLink(): string | null {
    return this._selfLink;
  }
  get publisher(): string | null {
    return this._publisher;
  }
  get publishedDate(): string | null {
    return this._publishedDate;
  }
  get pageCount(): number | null {
    return this._pageCount;
  }
  get language(): string | null {
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
}
