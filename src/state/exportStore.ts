import { create } from "zustand";

type ActionStore = {
  action: boolean;

  setAction: (action: boolean) => void;
};

export const useActionStore = create<ActionStore>((set) => ({
  action: false,
  setAction: (action) => set(() => ({ action: action })),
}));
