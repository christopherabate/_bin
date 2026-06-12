import { universes } from "../../data";
import { startUniverse } from "../../engine";

export function bindShelves() {
    const app = document.querySelector("#app")!;

    universes.forEach(u => {
        const btn = document.createElement("button");
        btn.textContent = u.name;

        btn.addEventListener("click", () => {
            startUniverse(u);
        });

        app.appendChild(btn);
    });
}