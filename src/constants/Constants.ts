import { 
    GAME_DATA_EN,
    CreatureTypeKey,
    SizeKey, 
    AlignmentKey, 
    DamageTypeKey, 
    ConditionKey,
    ConditionDescriptionKey
} from './game_data_i18n';

export const CREATURE_TYPES: readonly CreatureTypeKey[] = [
    'ABERRATION',
    'BEAST',
    'CELESTIAL',
    'CONSTRUCT',
    'DRAGON',
    'ELEMENTAL',
    'FEY',
    'FIEND',
    'GIANT',
    'HUMANOID',
    'MONSTROSITY',
    'OOZE',
    'PLANT',
    'UNDEAD'
] as const;

export const CREATURE_SIZES: readonly SizeKey[] = [
    'TINY', 'SMALL', 'MEDIUM', 'LARGE', 'HUGE', 'GARGANTUAN'
] as const;

export const ALIGNMENTS: readonly AlignmentKey[] = [
    'NO_ALIGNMENT',
    'LAWFUL_GOOD',
    'NEUTRAL_GOOD', 
    'CHAOTIC_GOOD',
    'LAWFUL_NEUTRAL',
    'NEUTRAL',
    'CHAOTIC_NEUTRAL',
    'LAWFUL_EVIL',
    'NEUTRAL_EVIL',
    'CHAOTIC_EVIL'
] as const;

export const DAMAGE_TYPES: readonly DamageTypeKey[] = [
    'BLUDGEONING',
    'PIERCING',
    'SLASHING',
    'FIRE',
    'POISON',
    'COLD',
    'NECROTIC',
    'RADIANT',
    'ACID',
    'FORCE',
    'LIGHTNING',
    'PSYCHIC',
    'THUNDER',
    'SILVERED_WEAPONS',
    'ADAMANTINE_WEAPONS',
    'MAGIC_WEAPONS'
] as const;

export const CONDITIONS: readonly ConditionKey[] = [
    'BLINDED',
    'CHARMED',
    'DEAFENED',
    'EXHAUSTED',
    'FRIGHTENED',
    'GRAPPLED',
    'INCAPACITATED',
    'INVISIBLE',
    'MUTE',
    'PARALYZED',
    'PETRIFIED',
    'POISONED',
    'PRONE',
    'RESTRAINED',
    'STUNNED',
    'UNCONSCIOUS'
] as const;

export const CONDITION_DESCRIPTIONS: readonly ConditionDescriptionKey[] = [
    'BLINDED',
    'CHARMED',
    'DEAFENED',
    'EXHAUSTED',
    'FRIGHTENED',
    'GRAPPLED',
    'INCAPACITATED',
    'INVISIBLE',
    'MUTE',
    'PARALYZED',
    'PETRIFIED',
    'POISONED',
    'PRONE',
    'RESTRAINED',
    'STUNNED',
    'UNCONSCIOUS'
] as const;

export type CreatureType = CreatureTypeKey;
export type CreatureSize = SizeKey;
export type Alignment = AlignmentKey;
export type DamageType = DamageTypeKey;
export type Condition = ConditionKey;
export type ConditionDescription = ConditionDescriptionKey;

export type { CreatureTypeKey, SizeKey, AlignmentKey, DamageTypeKey, ConditionKey };