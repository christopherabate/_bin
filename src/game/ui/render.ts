import { state } from "../stateMachine";

import mainScreen from "../../screens/main.html?raw";
import shelvesScreen from "../../screens/shelves.html?raw";
import bookScreen from "../../screens/book.html?raw";

import { bindMenu } from "./screens/menu";
import { bindShelves } from "./screens/shelves";
import { bindEncounter } from "./screens/encounter";

export function render() {
    const app = document.querySelector("#app")!;

    switch (state.screen) {
        case "menu":
            app.innerHTML = mainScreen;
            bindMenu();
            break;

        case "shelves":
            app.innerHTML = shelvesScreen;
            bindShelves();
            break;

        case "encounter":
            app.innerHTML = bookScreen;
            bindEncounter();
            break;

        case "end":
            app.innerHTML = `<h1>END</h1>`;
            break;
    }
}