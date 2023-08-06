import type { ChangeEvent } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SearchUsersTextState {
  searchUsersText: string;
  setSearchUsersText: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useSearchUsersText = create<SearchUsersTextState>()(
  devtools(
    persist(
      (set) => ({
        searchUsersText: "",
        setSearchUsersText: (e) =>
          set((state) => ({
            searchUsersText: (state.searchUsersText = e.target.value),
          })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
