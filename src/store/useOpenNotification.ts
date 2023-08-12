import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface OpenNotification {
  isNotificationOpen: boolean;
  setIsNotificationOpen: (by: boolean) => void;
}

export const useOpenNotification = create<OpenNotification>()(
  devtools(
    persist(
      (set) => ({
        isNotificationOpen: false,
        setIsNotificationOpen: (by) =>
          set((state) => ({
            isNotificationOpen: (state.isNotificationOpen = by),
          })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
