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
    typeKey: string;
    subtype: string;
    size: string;
    sizeKey: string;
    alignment: string;
    alignmentKey: string;
    ac: number;
    hit_dice: string;
    speed: string;
    initiative: number;
    proficiency_bonus: number;
    characteristics: number[];
    saving_throws: number[];
    skills: string;
    senses: string;
    alchemy_ingredients: string;
    craft_ingredients: string;
    staements: string;
    damage_resistances: string[];
    damage_vulnerabilities: string[];
    damage_immunities: string[];
    condition_immunities: string[];
    languages: string;
    race: string;
    gender: string;
    notable_items: string;
    habitat: string;
    traits: CreatureTrait[];
    actions: CreatureAction[];
    bonus_actions: CreatureAction[];
    reactions: CreatureAction[];
    legendary_actions: CreatureAction[];
    tactics: string;
    created: number;
    updated: number;
}
export interface BestiaryData {
    creatures: Creature[];
    lastUpdated: number;
}