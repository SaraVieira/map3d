import { create } from "zustand";

type AreaStore = {
  areas: any;
  center: {
    lat: number;
    lng: number;
  }[];

  appendAreas: (areas: []) => void;
  setCenter: (center: []) => void;
};

export const useAreaStore = create<AreaStore>((set) => ({
  areas: [],
  center: [
    {
      lat: 36.48888914657037,
      lng: 127.26794242858888,
    },
    {
      lat: 36.48023136458878,
      lng: 127.25330829620363,
    },
  ],
  appendAreas: (areas) => set(() => ({ areas: [...areas] })),
  setCenter: (center) => set(() => ({ center: [...center] })),
}));
