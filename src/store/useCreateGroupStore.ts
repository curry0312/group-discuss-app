import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface BearState {
  isCreateGroupOpen: boolean;
  onOpen: (by: boolean) => void;
  onClose: (by: boolean) => void;
}

const useCreateGroupStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        isCreateGroupOpen: false,
        onOpen: (by) =>
          set((state) => ({
            isCreateGroupOpen: (state.isCreateGroupOpen = true),
          })),
        onClose: (by) =>
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
