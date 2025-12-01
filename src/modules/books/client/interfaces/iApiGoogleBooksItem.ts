export interface IApiGoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    pageCount: number;
    categories: string[];
    language: string;
    industryIdentifiers?: { type: string; identifier: string | null }[];
    averageRating: number;
    ratingsCount: number;
    description: string;
  };
  searchInfo: {
    textSnippet: string;
  };
}