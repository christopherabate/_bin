import type { Universe } from "./types";

export const universes = [
    {
        name: "Dark Forest",
        worlds: [
            {
                name: "Edge",
                nodes: [
                    { type: "encounter", id: "n1", name: "Wolf" },
                    { type: "encounter", id: "n2", name: "Bandit" },
                    { type: "event", id: "n3", name: "Welcome" },
                    { type: "encounter", id: "n4", name: "Boss" }
                ]
            }
        ]
    },
    {
        name: "Crystal Desert",
        worlds: [
            {
                name: "Sands",
                nodes: [{ type: "encounter", id: "n1", name: "Scorpion" }]
            }
        ]
    }
] satisfies Universe[];