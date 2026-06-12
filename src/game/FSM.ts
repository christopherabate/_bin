export type World = {
    id: string;
    name: string;
    floors: {
        id: string;
        name: string;
        nodes: {
            id: string;
            type: "encounter" | "reward";
            name: string;
        }[];
    }[];
};

export type Enemy = {
    id: string;
    type: "unit" | "boss";
    name: string;
};

export type Card = {
    id: string;
    name: string;
    rarity: "starter" | "common" | "rare" | "epic" | "legendary";
};

export type Save = {
    id: string;
    collection: {
        card: string;
    }[];
    run?: string;
};

export type Run = {
    id: string;
    node: string;
    deck: {
        card: string;
        upgraded: boolean;
    }[];
    seed: number;
};

export type State =
    | "BootState"
    | "SaveSelectState"
    | "WorldSelectState"
    | "RunState"
    | "NodeState";

export type Screen =
    | "BootScreen"
    | "SaveSelectScreen"
    | "WorldSelectScreen"
    | "NodeScreen";

export type Action =
    | { type: "CREATE_SAVE" }
    | { type: "LOAD_SAVE"; saveId: string }
    | { type: "SELECT_WORLD"; worldId: string }
    | { type: "START_RUN" }
    | { type: "CONTINUE_RUN" }
    | { type: "SELECT_NODE"; nodeId: string };

export type Guard = (machine: Machine, action: Action) => boolean;
export type Effect = (machine: Machine, action: Action) => void;

export type Transition = {
    from: State;
    action: Action["type"];
    to: State;
    guard?: Guard;
    effect?: Effect;
};

/* ─────────────────────────────────────────────
   TRANSITIONS
───────────────────────────────────────────── */

const transitions: Transition[] = [

    /* ───────── BOOT ───────── */
    {
        from: "BootState",
        action: "CREATE_SAVE",
        to: "SaveSelectState",
    },

    /* ───────── CREATE SAVE ───────── */
    {
        from: "SaveSelectState",
        action: "CREATE_SAVE",

        effect: (machine) => {
            const save: Save = {
                id: crypto.randomUUID(),
                collection: [],
            };

            machine.data.saves.push(save);
            machine.currentSaveId = save.id;

            console.log("Save created:", save.id);
        },

        to: "WorldSelectState",
    },

    /* ───────── LOAD SAVE (RUN EXISTS) ───────── */
    {
        from: "SaveSelectState",
        action: "LOAD_SAVE",

        guard: (machine, action) => {
            if (action.type !== "LOAD_SAVE") return false;

            const save = machine.data.saves.find(
                s => s.id === action.saveId
            );

            return !!save?.run;
        },

        effect: (machine, action) => {
            if (action.type !== "LOAD_SAVE") return;

            const save = machine.data.saves.find(
                s => s.id === action.saveId
            );

            if (!save) return;

            machine.currentSaveId = save.id;

            console.log("Run loaded:", save.run);
        },

        to: "RunState",
    },

    /* ───────── LOAD SAVE (NO RUN) ───────── */
    {
        from: "SaveSelectState",
        action: "LOAD_SAVE",

        guard: (machine, action) => {
            if (action.type !== "LOAD_SAVE") return false;

            const save = machine.data.saves.find(
                s => s.id === action.saveId
            );

            return !!save && !save.run;
        },

        effect: (machine, action) => {
            if (action.type !== "LOAD_SAVE") return;

            machine.currentSaveId = action.saveId;

            console.log("Save loaded (no run)");
        },

        to: "WorldSelectState",
    },

    /* ───────── SELECT WORLD → CREATE RUN ───────── */
    {
        from: "WorldSelectState",
        action: "SELECT_WORLD",

        effect: (machine, action) => {

            if (action.type !== "SELECT_WORLD") return;

            const world = machine.data.worlds.find(
                w => w.id === action.worldId
            );

            if (!world) return;

            const firstNode = world.floors[0]?.nodes[0];

            if (!firstNode) return;

            const run: Run = {
                id: crypto.randomUUID(),
                node: firstNode.id,
                deck: [],
                seed: Date.now(),
            };

            machine.data.runs.push(run);

            const save = machine.save;
            if (save) save.run = run.id;

            console.log("Run created:", run.id);
        },

        to: "RunState",
    },

    /* ───────── RUN → NODE ───────── */
    {
        from: "RunState",
        action: "START_RUN",
        to: "NodeState",
    },

    {
        from: "RunState",
        action: "CONTINUE_RUN",
        to: "NodeState",
    },

    /* ───────── NODE NAVIGATION ───────── */
    {
        from: "NodeState",
        action: "SELECT_NODE",

        effect: (machine, action) => {

            if (action.type !== "SELECT_NODE") return;

            const run = machine.data.runs.find(
                r => r.id === machine.save?.run
            );

            if (!run) return;

            run.node = action.nodeId;

            console.log("Node selected:", action.nodeId);
        },

        to: "NodeState",
    },
];

/* ─────────────────────────────────────────────
   MACHINE
───────────────────────────────────────────── */

class Machine {

    state: State;

    data: {
        worlds: World[];
        enemies: Enemy[];
        cards: Card[];
        saves: Save[];
        runs: Run[];
    };

    currentSaveId?: string;

    constructor(data: Machine["data"]) {
        this.state = "BootState";
        this.data = data;
    }

    get save() {
        return this.data.saves.find(
            s => s.id === this.currentSaveId
        );
    }

    dispatch(action: Action) {

        const transition = transitions.find(t =>
            t.from === this.state &&
            t.action === action.type &&
            (!t.guard || t.guard(this, action))
        );

        if (!transition) return;

        transition.effect?.(this, action);

        this.state = transition.to;
    }
}

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */

const worlds: World[] = [
    {
        id: "world_1",
        name: "World 1",
        floors: [
            {
                id: "floor_1",
                name: "Floor 1",
                nodes: [
                    { id: "n1", type: "encounter", name: "Fight 1" },
                    { id: "n2", type: "reward", name: "Reward" },
                ]
            }
        ]
    }
];

const saves: Save[] = [];

const cards: Card[] = [
    { id: "c1", name: "Strike", rarity: "starter" },
    { id: "c2", name: "Defend", rarity: "starter" }
];

const enemies: Enemy[] = [
    { id: "e1", type: "unit", name: "Slime" },
    { id: "e2", type: "boss", name: "Goblin King" }
];

/* ─────────────────────────────────────────────
   BOOT + TEST
───────────────────────────────────────────── */

const machine = new Machine({
    worlds,
    saves,
    runs: [],
    enemies,
    cards,
});

machine.dispatch({ type: "CREATE_SAVE" });

machine.dispatch({
    type: "SELECT_WORLD",
    worldId: "world_1"
});

machine.dispatch({ type: "START_RUN" });

machine.dispatch({
    type: "SELECT_NODE",
    nodeId: "n2"
});