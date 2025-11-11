export interface Creature {
    id: string;
    name: string;
    type: string;
    size: string;
    alignment: string;
    ac: number;
    hp: number;
    speed: string;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    skills: string;
    senses: string;
    languages: string;
    habitat: string;
    traits: string;
    actions: string;
    legendaryActions: string;
    notes: string;
    created: number;
    updated: number;
}

export interface BestiaryData {
    creatures: Creature[];
    lastUpdated: number;
}