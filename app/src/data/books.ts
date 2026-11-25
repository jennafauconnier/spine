export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  pages: number;
  publisher: string;
  readers: number;
  average: number;
  /** deux couleurs pour la couverture de secours */
  art: [string, string];
  ink?: string;
  why?: string;
};

export const BOOKS: Book[] = [
  {
    id: 'nom-du-vent',
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    year: 2009,
    pages: 662,
    publisher: 'Bragelonne',
    readers: 1204,
    average: 4.2,
    art: ['#2F4BE0', '#101A55'],
    why: 'Dune',
  },
  {
    id: 'siddhartha',
    title: 'Siddhartha',
    author: 'Hermann Hesse',
    year: 1922,
    pages: 152,
    publisher: 'Le Livre de Poche',
    readers: 8600,
    average: 4.0,
    art: ['#EFE6D2', '#C2A87B'],
    ink: '#2A2118',
    why: "L'Étranger",
  },
  {
    id: 'la-route',
    title: 'La Route',
    author: 'Cormac McCarthy',
    year: 2006,
    pages: 232,
    publisher: 'Points',
    readers: 5400,
    average: 3.9,
    art: ['#C9C9C4', '#6E6E68'],
    ink: '#141414',
  },
  {
    id: 'les-furtifs',
    title: 'Les Furtifs',
    author: 'Alain Damasio',
    year: 2019,
    pages: 720,
    publisher: 'La Volte',
    readers: 2100,
    average: 4.1,
    art: ['#E4572E', '#8C2A12'],
  },
  {
    id: 'dune',
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    pages: 624,
    publisher: 'Robert Laffont',
    readers: 15200,
    average: 4.3,
    art: ['#3C7A5A', '#123327'],
  },
  {
    id: 'kafka-rivage',
    title: 'Kafka sur le rivage',
    author: 'Haruki Murakami',
    year: 2002,
    pages: 512,
    publisher: 'Belfond',
    readers: 9800,
    average: 4.0,
    art: ['#6C5CE7', '#2A1E6B'],
  },
  {
    id: 'etranger',
    title: "L'Étranger",
    author: 'Albert Camus',
    year: 1942,
    pages: 184,
    publisher: 'Gallimard',
    readers: 31000,
    average: 3.8,
    art: ['#F2C94C', '#B57C11'],
    ink: '#2A1E05',
  },
];

export const CURRENT = BOOKS[2]; // La Route, en cours
export const SUGGESTIONS = [BOOKS[0], BOOKS[1]];
export const NEXT_UP = [BOOKS[3], BOOKS[4], BOOKS[6]];

export function bookById(id?: string) {
  return BOOKS.find((b) => b.id === id) ?? BOOKS[0];
}
