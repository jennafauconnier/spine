import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Status = 'read' | 'dnf' | 'reread';

export type Entry = {
  id: string;
  bookId: string;
  value: number;
  review?: string;
  status: Status;
  createdAt: number;
  pending?: boolean;
};

type Store = {
  entries: Entry[];
  rate: (input: { bookId: string; value: number; review?: string; status?: Status; pending?: boolean }) => void;
  ratingOf: (bookId: string) => Entry | undefined;
};

const Ctx = createContext<Store | null>(null);

const seed: Entry[] = [
  {
    id: 'seed-1',
    bookId: 'la-route',
    value: 3,
    review: 'Lu en trois jours.',
    status: 'read',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 17,
  },
  {
    id: 'seed-2',
    bookId: 'siddhartha',
    value: 2,
    status: 'dnf',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 23,
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(seed);

  const rate: Store['rate'] = useCallback((input) => {
    setEntries((prev) => [
      {
        id: `e-${Date.now()}`,
        bookId: input.bookId,
        value: input.value,
        review: input.review?.trim() || undefined,
        status: input.status ?? 'read',
        createdAt: Date.now(),
        pending: input.pending,
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo<Store>(
    () => ({
      entries,
      rate,
      ratingOf: (bookId) => entries.find((e) => e.bookId === bookId),
    }),
    [entries, rate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore doit être utilisé dans <StoreProvider>');
  return ctx;
}
