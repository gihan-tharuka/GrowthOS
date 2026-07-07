import { create } from "zustand";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

type PlannerState = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

export const usePlannerStore = create<PlannerState>((set) => ({
  selectedDate: todayString(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
