export type QuotesData = {
  author: string;
  text: string;
  origin: string;
  popularity: number;
  tags: string[];
};

export type AuthorData = {
  name: string;
  bornPlace: string;
  bornDate: string;
  deathDate: string;
  website: string;
  genres: string[];
  bio: string;
  rating: number;
  popularity: number;
  image: string;
};

export type BookDataCharacters = {
  title: string;
  author: string;
  rating: number;
  popularity: number;
  description: string;
  genres: string[];
  pages: number;
  date: string;
  image: string;
  series: {
    name: string;
    part: number;
  };
  characters: {
    name: string;
    link: string;
  }[];
};

export type PopulateData = {
  quotesData: QuotesData[];
  authorData: AuthorData[];
  bookDataCharacters: BookDataCharacters[];
};
