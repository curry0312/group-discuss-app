import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CreateGroupStoreState {
  isCreateGroupOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateGroupStore = create<CreateGroupStoreState>()(
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
