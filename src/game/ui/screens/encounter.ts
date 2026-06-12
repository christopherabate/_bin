import { playTurn } from "../../engine";

export function bindEncounter() {
    const app = document.querySelector("#app")!;

    app.querySelectorAll("[data-action]").forEach(btn => {
        btn.addEventListener("click", () => {
            const value = Number(
                (btn as HTMLElement).dataset.action
            );

            playTurn(value);
        });
    });
}