import type { Universe, Run, Encounter } from "./types";
import { render } from "./ui/render";

export type Screen =
    | "menu"
    | "shelves"
    | "encounter"
    | "end";

export type State = {
    screen: Screen;
    universe?: Universe;
    run: Run | null;
    encounter: Encounter | null;
};

export let state: State = {
    screen: "menu",
    run: null,
    encounter: null
};

export function setState(next: Partial<State>) {
    state = {
        ...state,
        ...next
    };

    render();
}