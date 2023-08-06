import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface OpenNotification {
  isNotificationOpen: boolean;
  setIsNotificationOpen: () => void;
}

export const useOpenNotification = create<OpenNotification>()(
  devtools(
    persist(
      (set) => ({
        isNotificationOpen: false,
        setIsNotificationOpen: () =>
          set((state) => ({
            isNotificationOpen: (state.isNotificationOpen =
              !state.isNotificationOpen),
          })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
