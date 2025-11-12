export interface Creature {
    id: string;
    name: string;
    type: string;
    size: string;
    alignment: string;
    ac: number;
    hit_dice: string;
    speed: string;
    initiative: number;
    proficiency_bonus: number;
    characteristics: number[];
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