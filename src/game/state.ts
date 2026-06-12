import type { Save, Run, Encounter } from "./types";

export const save: Save = {
    id: "save-1",
    runs: {}
};

export let run: Run | null = null;
export let encounter: Encounter | null = null;

export function setRun(value: Run | null) {
    run = value;
}

export function setEncounter(value: Encounter | null) {
    encounter = value;
}
