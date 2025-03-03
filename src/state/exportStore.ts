import { create } from "zustand";

type ActionStore = {
  action: boolean
  exportType: "glb"

  setAction: (action: boolean) => void
}

export const useActionStore = create<ActionStore>((set) => ({
  action: false,
  exportType: "glb",
  setAction: (action) => set(() => ({ action: action })),
}))
