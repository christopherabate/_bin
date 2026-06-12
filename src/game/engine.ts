import { state, setState } from "./stateMachine";
import type { Universe } from "./types";

/* ---------------------------
   DEBUG LOGGER
---------------------------- */

function log(...args: any[]) {
    console.log("[GAME]", ...args);
}

/* ---------------------------
   RESOLVE
---------------------------- */

function resolve(progress: number): "lose" | "win" | null {
    if (progress <= 0) return "lose";
    if (progress >= 100) return "win";
    return null;
}

/* ---------------------------
   START
---------------------------- */

export function startGame() {
    log("START GAME");

    setState({
        screen: "menu",
        run: null,
        encounter: null
    });
}

/* ---------------------------
   UNIVERSE START
---------------------------- */

export function startUniverse(universe: Universe) {
    log("START UNIVERSE", universe.name);

    setState({
        screen: "encounter",
        universe,
        run: {
            id: "run-" + Date.now(),
            deck: [],
            nodes: []
        },
        encounter: {
            hand: [],
            discard: [],
            turn: 0,
            progress: 50,
            running: true,
            intent: undefined
        }
    });
}

/* ---------------------------
   TURN (STRICT ORIGINAL FLOW)
---------------------------- */

export function playTurn(playerValue: number) {
    const s = state;

    if (!s.encounter || !s.universe || !s.run) return;

    const e = s.encounter;

    log("TURN START", e.turn + 1);
    log("PLAYER INPUT", playerValue);

    /* ---------------- PLAYER PHASE ---------------- */

    const afterPlayer = {
        ...e,
        turn: e.turn + 1,
        progress: e.progress + playerValue
    };

    log("AFTER PLAYER", afterPlayer.progress);

    const playerOutcome = resolve(afterPlayer.progress);

    if (playerOutcome === "lose") {
        log("DEFEAT (player)");
        setState({ screen: "menu", encounter: null });
        return;
    }

    if (playerOutcome === "win") {
        log("VICTORY (player)");
        continueRun();
        return;
    }

    /* ---------------- SYSTEM PHASE ---------------- */

    const systemValue = -Math.floor(Math.random() * 11);

    log("SYSTEM INPUT", systemValue);

    const afterSystem = {
        ...afterPlayer,
        progress: afterPlayer.progress + systemValue,
        intent: systemValue
    };

    log("AFTER SYSTEM", afterSystem.progress);

    const systemOutcome = resolve(afterSystem.progress);

    if (systemOutcome === "lose") {
        log("DEFEAT (system)");
        setState({ screen: "menu", encounter: null });
        return;
    }

    if (systemOutcome === "win") {
        log("VICTORY (system)");
        continueRun();
        return;
    }

    log("TURN END OK");

    setState({
        encounter: {
            ...afterSystem,
            intent: undefined
        }
    });
}

/* ---------------------------
   RUN PROGRESSION
---------------------------- */

function continueRun() {
    const s = state;

    if (!s.universe || !s.run) return;

    const world = s.universe.worlds[0];

    const visited = s.run.nodes.map(n => n.id);

    const next = world.nodes.find(
        n => n.type === "encounter" && !visited.includes(n.id)
    );

    if (!next) {
        log("WORLD COMPLETE");
        setState({
            screen: "menu",
            run: null,
            encounter: null
        });
        return;
    }

    log("NEXT NODE", next.name);

    setState({
        run: {
            ...s.run,
            nodes: [...s.run.nodes, next]
        },
        encounter: {
            hand: [],
            discard: [],
            turn: 0,
            progress: 50,
            running: true,
            intent: undefined
        }
    });
}