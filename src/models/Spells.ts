export interface SpellComponents {
  verbal: boolean;
  verbalDescription?: string;
  somatic: boolean;
  material: boolean;
  materialDescription?: string;
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  classes: string[];
  actionType: string;
  castingTrigger?: string;
  castingTime: string;
  range: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  components: SpellComponents;
  description: string;
  spellUpgrade?: string;
  summonCreature: boolean;
  summonedCreatures: string[];
  manaCost?: boolean;
  id: string;
  created: number;
  updated: number;
}

export interface SpellsData {
  spells: Spell[];
  lastUpdated: number;
}