import { 
    GAME_DATA_EN,
    CreatureTypeKey,
    SizeKey, 
    AlignmentKey, 
    DamageTypeKey, 
    ConditionKey,
    ConditionDescriptionKey,
    SpellSchoolKey,
    SpellClassKey,
    ActionTypeKey
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

export const SPELL_SCHOOLS: readonly SpellSchoolKey[] = [
        'ABJURATION',
        'CONJURATION',
        'DIVINATION',
        'ENCHANTMENT',
        'EVOCATION',
        'ILLUSION',
        'NECROMANCY',
        'TRANSMUTATION'
] as const;

export const SPELL_CLASSES: readonly SpellClassKey[] = [
    'ARTIFICER',
    'BARD',
    'CLERIC',
    'DRUID',
    'PALADIN',
    'RANGER',
    'SORCERER',
    'WARLOCK',
    'WIZARD'
] as const;

export const ACTION_TYPES: readonly ActionTypeKey[] = [
    'ACTION',
    'BONUS_ACTION',
    'REACTION',
    'MINUTE',
    'HOUR'
]

export type CreatureType = CreatureTypeKey;
export type CreatureSize = SizeKey;
export type Alignment = AlignmentKey;
export type DamageType = DamageTypeKey;
export type Condition = ConditionKey;
export type ConditionDescription = ConditionDescriptionKey;
export type SpellSchool = SpellSchoolKey;
export type SpellClass = SpellClassKey;
export type ActionType = ActionTypeKey;

export type { CreatureTypeKey, SizeKey, AlignmentKey, DamageTypeKey, ConditionKey, SpellSchoolKey, SpellClassKey, ActionTypeKey };