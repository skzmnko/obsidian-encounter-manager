export interface CreatureTrait {
    name: string;
    desc: string;
}
export interface CreatureAction {
    name: string;
    desc: string;
}
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
    saving_throws: number[];
    skills: string;
    damage_resistances: string[];
    damage_vulnerabilities: string[];
    damage_immunities: string[];
    condition_immunities: string[];
    senses: string;
    languages: string;
    habitat: string;
    traits: CreatureTrait[];
    actions: CreatureAction[];
    bonus_actions: CreatureAction[];
    reactions: CreatureAction[];
    legendary_actions: CreatureAction[];
    notes: string;
    created: number;
    updated: number;
}

export interface BestiaryData {
    creatures: Creature[];
    lastUpdated: number;
}