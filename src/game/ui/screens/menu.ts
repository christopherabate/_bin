import { setState } from "../../stateMachine";

export function bindMenu() {
    const app = document.querySelector("#app")!;

    const btn = document.createElement("button");
    btn.textContent = "Play";

    btn.addEventListener("click", () => {
        setState({ screen: "shelves" });
    });

    app.appendChild(btn);
}