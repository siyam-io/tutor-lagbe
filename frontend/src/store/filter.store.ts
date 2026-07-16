"use client";

import { create } from "zustand";
import type { TutorFilters } from "@shared/types";

interface FilterState {
  filters: TutorFilters;
  setFilter: <K extends keyof TutorFilters>(
    key: K,
    value: TutorFilters[K]
  ) => void;
  resetFilters: () => void;
}

const defaultFilters: TutorFilters = {
  page: 1,
  limit: 12,
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
