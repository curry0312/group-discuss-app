import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface BearState {
  isCreateGroupOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateGroupStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        isCreateGroupOpen: false,
        onOpen: () =>
          set((state) => ({
            isCreateGroupOpen: (state.isCreateGroupOpen = true),
          })),
        onClose: () =>
          set((state) => ({
            isCreateGroupOpen: (state.isCreateGroupOpen = false),
          })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
