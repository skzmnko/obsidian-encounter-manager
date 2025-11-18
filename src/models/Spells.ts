export interface Spell {
    id: string;
    name: string;
    level: number;
    school: string;
    classes: string[];
    actionType: string;
    concentration: boolean;
    ritual: boolean;
    castingTime: string;
    range: string;
    components: {
        verbal: boolean;
        somatic: boolean;
        material: boolean;
        materialDescription?: string;
    };
    duration: string;
    description: string;
    cantripUpgrade?: string;
    manaCost?: boolean;
    created: number;
    updated: number;
}

export interface SpellsData {
    spells: Spell[];
    lastUpdated: number;
}