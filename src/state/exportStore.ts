import { create } from "zustand";

type ActionStore = {
  action: boolean;
  fleetSpaceId: string;
  exportType: "glb" | "fleet";

  setAction: (action: boolean) => void;
  setFleet: (fleetSpaceId: string, exportType: "glb" | "fleet") => void;
};

export const useActionStore = create<ActionStore>((set) => ({
  action: false,
  fleetSpaceId: "",
  exportType: "glb",
  setAction: (action) => set(() => ({ action: action })),
  setFleet: (fleetSpaceId, exportType) =>
    set(() => ({ fleetSpaceId: fleetSpaceId, exportType: exportType })),
}));
