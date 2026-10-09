import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { LATEST_DATE, SEED } from "./seed";
import type { Entry } from "./types";

type BicaState = {
  entries: Entry[];
  selected: string[];
  includeSchedule: boolean;
  toggle: (id: string) => void;
  setSelected: (ids: string[]) => void;
  clearSelected: () => void;
  upsert: (entry: Entry) => void;
  remove: (id: string) => void;
  setIncludeSchedule: (value: boolean) => void;
  resetPresets: () => void;
};

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useBica = create<BicaState>()(
  persist(
    (set) => ({
      entries: SEED,
      selected: SEED.filter((entry) => entry.date === LATEST_DATE).map((entry) => entry.id),
      includeSchedule: true,
      toggle: (id) =>
        set((state) => ({
          selected: state.selected.includes(id)
            ? state.selected.filter((item) => item !== id)
            : [...state.selected, id],
        })),
      setSelected: (ids) => set({ selected: [...new Set(ids)] }),
      clearSelected: () => set({ selected: [] }),
      upsert: (entry) =>
        set((state) => {
          const exists = state.entries.some((item) => item.id === entry.id);
          return {
            entries: exists
              ? state.entries.map((item) => (item.id === entry.id ? entry : item))
              : [...state.entries, entry],
            selected: state.selected.includes(entry.id) ? state.selected : [...state.selected, entry.id],
          };
        }),
      remove: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
          selected: state.selected.filter((item) => item !== id),
        })),
      setIncludeSchedule: (value) => set({ includeSchedule: value }),
      resetPresets: () =>
        set((state) => {
          const custom = state.entries.filter((entry) => !entry.preset);
          const entries = [...SEED, ...custom];
          const ids = new Set(entries.map((entry) => entry.id));
          return {
            entries,
            selected: state.selected.filter((id) => ids.has(id)),
          };
        }),
    }),
    {
      name: "bica-l449-v1",
      skipHydration: true,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : window.localStorage,
      ),
    },
  ),
);
