import type { BookType } from "../../../../utils/types/searchTypes";

export interface IApiGoogleBooksItem {
  id: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors: string[];
    printType: BookType;
    publisher: string;
    publishedDate: string;
    pageCount: number;
    language: string;
    industryIdentifiers?: { type: string; identifier: string | null }[];
    averageRating: number;
    ratingsCount: number;
    description: string;
  };
}