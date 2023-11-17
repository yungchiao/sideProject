interface AppState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;

  otherState: string;
  setOtherState: (value: string) => void;
}

import { create } from "zustand";

const useAppStore = create < AppState > ((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

  otherState: "initialValue",
  setOtherState: (value) => set({ otherState: value }),
}));

export default useAppStore;
