import { create } from "zustand";

export type ScenePhase = "home" | "docked";

interface SceneState {
  /** "home" centres the eye full-bleed; "docked" pins it to the rail. */
  phase: ScenePhase;
  /** Index into NODES, or -1 when nothing is selected. */
  activeNode: number;
  setPhase: (phase: ScenePhase) => void;
  setActiveNode: (index: number) => void;
}

/**
 * Discrete scene state only — things that change at human speed.
 *
 * Pointer position and orbit rotation are deliberately absent: they change every
 * frame and live in motion values instead. See usePointer.
 */
export const useSceneStore = create<SceneState>((set) => ({
  phase: "home",
  activeNode: -1,
  setPhase: (phase) => set({ phase }),
  setActiveNode: (activeNode) => set({ activeNode }),
}));
