import { create } from "zustand";

type UiState = {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (isOpen: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
}));
