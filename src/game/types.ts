export type Universe = {
    name: string;
    worlds: {
        name: string;
        nodes: (
            | { type: "encounter"; id: string; name: string }
            | { type: "event"; id: string; name: string }
            | { type: "shop"; id: string; name: string }
            | { type: "reward"; id: string; name: string }
        )[];
    }[];
};

export type Save = {
    id: string;
    run?: string;
    runs: Record<string, Run>;
};

export type Run = {
    id: string;
    deck: string[];
    nodes: Universe["worlds"][number]["nodes"][number][];
};

export type Encounter = {
    hand: string[];
    discard: string[];
    turn: number;
    progress: number;
    running: boolean;
    intent?: number;
};
