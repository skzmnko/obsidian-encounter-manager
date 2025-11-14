// English game data
export const GAME_DATA_EN = {
    SIZES: {
        TINY: 'Tiny',
        SMALL: 'Small',
        MEDIUM: 'Medium',
        LARGE: 'Large',
        HUGE: 'Huge',
        GARGANTUAN: 'Gargantuan'
    },
    ALIGNMENTS: {
        NO_ALIGNMENT: 'No Alignment',
        LAWFUL_GOOD: 'Lawful Good',
        NEUTRAL_GOOD: 'Neutral Good',
        CHAOTIC_GOOD: 'Chaotic Good',
        LAWFUL_NEUTRAL: 'Lawful Neutral',
        NEUTRAL: 'True Neutral',
        CHAOTIC_NEUTRAL: 'Chaotic Neutral',
        LAWFUL_EVIL: 'Lawful Evil',
        NEUTRAL_EVIL: 'Neutral Evil',
        CHAOTIC_EVIL: 'Chaotic Evil'
    },
    DAMAGE_TYPES: {
        BLUDGEONING: 'Bludgeoning (Non-Magical Weapons)',
        PIERCING: 'Piercing (Non-Magical Weapons)',
        SLASHING: 'Slashing (Non-Magical Weapons)',
        FIRE: 'Fire',
        POISON: 'Poison',
        COLD: 'Cold',
        NECROTIC: 'Necrotic',
        RADIANT: 'Radiant',
        ACID: 'Acid',
        FORCE: 'Force',
        LIGHTNING: 'Lightning',
        PSYCHIC: 'Psychic',
        THUNDER: 'Thunder',
        SILVERED_WEAPONS: 'Silvered Weapons',
        ADAMANTINE_WEAPONS: 'Adamantine Weapons',
        MAGIC_WEAPONS: 'Magical Weapons'
    },
    CONDITIONS: {
        BLINDED: 'Blinded',
        CHARMED: 'Charmed',
        DEAFENED: 'Deafened',
        EXHAUSTED: 'Exhausted',
        FRIGHTENED: 'Frightened',
        GRAPPLED: 'Grappled',
        INCAPACITATED: 'Incapacitated',
        INVISIBLE: 'Invisible',
        MUTE: 'Mute',
        PARALYZED: 'Paralyzed',
        PETRIFIED: 'Petrified',
        POISONED: 'Poisoned',
        PRONE: 'Prone',
        RESTRAINED: 'Restrained',
        STUNNED: 'Stunned',
        UNCONSCIOUS: 'Unconscious'
    }
} as const;

// Russian game data
export const GAME_DATA_RU = {
    SIZES: {
        TINY: 'Крошечный',
        SMALL: 'Малый',
        MEDIUM: 'Средний',
        LARGE: 'Большой',
        HUGE: 'Огромный',
        GARGANTUAN: 'Громадный'
    },
    ALIGNMENTS: {
        NO_ALIGNMENT: 'Без мировоззрения',
        LAWFUL_GOOD: 'Законно-Доброе',
        NEUTRAL_GOOD: 'Нейтрально-Доброе',
        CHAOTIC_GOOD: 'Хаотично-Доброе',
        LAWFUL_NEUTRAL: 'Законно-Нейтральное',
        NEUTRAL: 'Истинно-Нейтральное',
        CHAOTIC_NEUTRAL: 'Хаотично-Нейтральное',
        LAWFUL_EVIL: 'Законно-Злое',
        NEUTRAL_EVIL: 'Нейтрально-Злое',
        CHAOTIC_EVIL: 'Хаотично-Злое'
    },
    DAMAGE_TYPES: {
        BLUDGEONING: 'Дробящий  от немагических атак',
        PIERCING: 'Колющий  от немагических атак',
        SLASHING: 'Рубящий  от немагических атак',
        FIRE: 'Огонь',
        POISON: 'Яд',
        COLD: 'Холод',
        NECROTIC: 'Некротическая энергия',
        RADIANT: 'Излучение',
        ACID: 'Кислота',
        FORCE: 'Силовое поле',
        LIGHTNING: 'Электричество',
        PSYCHIC: 'Психическая энергия',
        THUNDER: 'Гром (звук)',
        SILVERED_WEAPONS: 'Посеребреное оружие',
        ADAMANTINE_WEAPONS: 'Адамантиновое оружие',
        MAGIC_WEAPONS: 'Магическое оружие'
    },
    CONDITIONS: {
        BLINDED: 'Ослепленный',
        CHARMED: 'Очарованный',
        DEAFENED: 'Оглохший',
        EXHAUSTED: 'Истощенный',
        FRIGHTENED: 'Испуганный',
        GRAPPLED: 'Схваченный',
        INCAPACITATED: 'Недееспособный',
        INVISIBLE: 'Невидимый',
        MUTE: 'Немой',
        PARALYZED: 'Парализованный',
        PETRIFIED: 'Окаменевший',
        POISONED: 'Отравленный',
        PRONE: 'Сбитый с ног',
        RESTRAINED: 'Опутанный',
        STUNNED: 'Ошеломленный',
        UNCONSCIOUS: 'Без сознания'
    }
} as const;

export type GameDataKey = keyof typeof GAME_DATA_EN;
export type SizeKey = keyof typeof GAME_DATA_EN.SIZES;
export type AlignmentKey = keyof typeof GAME_DATA_EN.ALIGNMENTS;
export type DamageTypeKey = keyof typeof GAME_DATA_EN.DAMAGE_TYPES;
export type ConditionKey = keyof typeof GAME_DATA_EN.CONDITIONS;