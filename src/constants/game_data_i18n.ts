// English game data
export const GAME_DATA_EN = {
    CREATURE_TYPES: {
        ABERRATION: 'Aberration',
        BEAST: 'Beast',
        CELESTIAL: 'Celestial',
        CONSTRUCT: 'Construct',
        DRAGON: 'Dragon',
        ELEMENTAL: 'Elemental',
        FEY: 'Fey',
        FIEND: 'Fiend',
        GIANT: 'Giant',
        HUMANOID: 'Humanoid',
        MONSTROSITY: 'Monstrosity',
        OOZE: 'Ooze',
        PLANT: 'Plant',
        UNDEAD: 'Undead'
    },
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
    },
    CONDITION_DESCRIPTIONS: {
        BLINDED: 'A blinded creature can\'t see and automatically fails any ability check that requires sight. Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage.',
        CHARMED: 'A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with the creature.',
        DEAFENED: 'A deafened creature can\'t hear and automatically fails any ability check that requires hearing.',
        EXHAUSTED: 'Some special abilities and environmental hazards, such as starvation and the long-term effects of freezing or scorching temperatures, can lead to a special condition called exhaustion. Exhaustion is measured in six levels. An effect can give a creature one or more levels of exhaustion, as specified in the effect\'s description.\n\n1: Disadvantage on ability checks\n2: Speed halved\n3: Disadvantage on attack rolls and saving throws\n4: Hit point maximum halved\n5: Speed reduced to 0\n6: Death',
        FRIGHTENED: 'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can\'t willingly move closer to the source of its fear.',
        GRAPPLED: 'A grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed. The condition ends if the grappler is incapacitated. The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect, such as when a creature is hurled away by the thunderwave spell.',
        INCAPACITATED: 'An incapacitated creature can\'t take actions or reactions.',
        INVISIBLE: 'An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature\'s location can be detected by any noise it makes or any tracks it leaves. Attack rolls against the creature have disadvantage, and the creature\'s attack rolls have advantage.',
        MUTE: 'A mute creature can\'t speak and can\'t cast spells with verbal components.',
        PARALYZED: 'A paralyzed creature is incapacitated and can\'t move or speak. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.',
        PETRIFIED: 'A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging. The creature is incapacitated, can\'t move or speak, and is unaware of its surroundings. Attack rolls against the creature have advantage. The creature automatically fails Strength and Dexterity saving throws. The creature has resistance to all damage. The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.',
        POISONED: 'A poisoned creature has disadvantage on attack rolls and ability checks.',
        PRONE: 'A prone creature\'s only movement option is to crawl, unless it stands up and thereby ends the condition. The creature has disadvantage on attack rolls. An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.',
        RESTRAINED: 'A restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed. Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage. The creature has disadvantage on Dexterity saving throws.',
        STUNNED: 'A stunned creature is incapacitated, can\'t move, and can speak only falteringly. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage.',
        UNCONSCIOUS: 'An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings. The creature drops whatever it\'s holding and falls prone. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.'
    },
    SPELL_SCHOOLS: {
        ABJURATION: 'Abjuration',
        CONJURATION: 'Conjuration',
        DIVINATION: 'Divination',
        ENCHANTMENT: 'Enchantment',
        EVOCATION: 'Evocation',
        ILLUSION: 'Illusion',
        NECROMANCY: 'Necromancy',
        TRANSMUTATION: 'Transmutation'
    },
    SPELL_CLASSES: {
        BARD: 'Bard',
        CLERIC: 'Cleric',
        DRUID: 'Druid',
        PALADIN: 'Paladin',
        RANGER: 'Ranger',
        SORCERER: 'Sorcerer',
        WARLOCK: 'Warlock',
        WIZARD: 'Wizard',
        ARTIFICER: 'Artificer'
    },
    ACTION_TYPES: {
        ACTION: 'Action',
        BONUS_ACTION: 'Bonus action',
        REACTION: 'Reaction',
        MINUTE: 'Minute',
        HOUR: 'Hour'
    }
} as const;

// Russian game data
export const GAME_DATA_RU = {
    CREATURE_TYPES: {
        ABERRATION: 'Аберрация',
        BEAST: 'Зверь',
        CELESTIAL: 'Небожитель',
        CONSTRUCT: 'Конструкт',
        DRAGON: 'Дракон',
        ELEMENTAL: 'Элементаль',
        FEY: 'Фея',
        FIEND: 'Исчадие',
        GIANT: 'Великан',
        HUMANOID: 'Гуманоид',
        MONSTROSITY: 'Монстр',
        OOZE: 'Слизь',
        PLANT: 'Растение',
        UNDEAD: 'Нежить'
    },
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
    },
        CONDITION_DESCRIPTIONS: {
        BLINDED: 'Ослеплённое существо ничего не видит и автоматически проваливает все проверки характеристик, связанные со зрением. Броски атаки по такому существу совершаются с преимуществом, а его броски атаки совершаются с помехой.',
        CHARMED: 'Очарованное существо не может атаковать того, кто его очаровал, а также делать его целью умения или магического эффекта, причиняющего вред. Искуситель совершает с преимуществом все проверки характеристик при социальном взаимодействии с очарованным существом.',
        DEAFENED: 'Оглохшее существо ничего не слышит и автоматически проваливает все проверки характеристик, связанные со слухом.',
        EXHAUSTION: 'Состояние истощения делится на шесть степеней.\n\n1: Помеха при проверках характеристик\n2: Скорость уменьшается вдвое\n3: Помеха при бросках атаки и спасбросках\n4: Максимум хитов уменьшается вдвое\n5: Скорость снижается до 0\n6: Смерть',
        FRIGHTENED: 'Испуганное существо совершает с помехой проверки характеристик и броски атаки, пока источник его страха находится в пределах его линии обзора. Существо не способно добровольно приблизиться к источнику своего страха.',
        GRAPPLED: 'Скорость схваченного существа равна 0, и оно не получает выгоды ни от каких бонусов к скорости. Состояние оканчивается, если схвативший становится недееспособным. Это состояние также оканчивается, если какой-либо эффект выводит схваченное существо из зоны досягаемости того, кто его удерживает, или из зоны удерживающего эффекта.',
        INCAPACITATED: 'Недееспособное существо не может совершать действия и реакции.',
        INVISIBLE: 'Невидимое существо невозможно увидеть без помощи магии или особого чувства. Броски атаки по невидимому существу совершаются с помехой, а его броски атаки — с преимуществом.',
        MUTE: 'Немое существо не может разговаривать и сотворять заклинания, требующие вербального компонента.',
        PARALYZED: 'Парализованное существо недееспособно и не способно перемещаться и говорить. Существо автоматически проваливает спасброски Силы и Ловкости. Броски атаки по парализованному существу совершаются с преимуществом. Любая атака, попавшая по такому существу, считается критическим попаданием, если нападающий находится в пределах 5 футов от существа.',
        PETRIFIED: 'Окаменевшее существо трансформируется в твёрдое инертное вещество. Существо недееспособно, не способно двигаться и говорить. Броски атаки по существу совершаются с преимуществом. Существо автоматически проваливает спасброски Силы и Ловкости. Существо получает сопротивление ко всем видам урона и иммунитет к ядам и болезням.',
        POISONED: 'Отравленное существо совершает с помехой броски атаки и проверки характеристик.',
        PRONE: 'Сбитое с ног существо способно перемещаться только ползком, пока не встанет, прервав тем самым это состояние. Существо совершает с помехой броски атаки. Броски атаки по существу совершаются с преимуществом, если нападающий находится в пределах 5 футов от него. В противном случае броски атаки совершаются с помехой.',
        RESTRAINED: 'Скорость опутанного существа равна 0, и оно не получает выгоды ни от каких бонусов к скорости. Броски атаки по такому существу совершаются с преимуществом, а его броски атаки — с помехой. Существо совершает с помехой спасброски Ловкости.',
        STUNNED: 'Ошеломлённое существо недееспособно, не способно перемещаться и говорит, запинаясь. Существо автоматически проваливает спасброски Силы и Ловкости. Броски атаки по существу совершаются с преимуществом.',
        UNCONSCIOUS: 'Находящееся без сознания существо недееспособно, не способно перемещаться и говорить, а также не осознаёт своё окружение. Существо роняет всё, что держит, и падает ничком. Существо автоматически проваливает спасброски Силы и Ловкости. Броски атаки по существу совершаются с преимуществом. Любая атака, попавшая по такому существу, считается критическим попаданием, если нападающий находится в пределах 5 футов от него.'
    },
    SPELL_SCHOOLS: {
        ABJURATION: 'Ограждение',
        CONJURATION: 'Воплощение',
        DIVINATION: 'Прорицание',
        ENCHANTMENT: 'Очарование',
        EVOCATION: 'Иллюзия',
        ILLUSION: 'Преобразование',
        NECROMANCY: 'Некромантия',
        TRANSMUTATION: 'Призыв'
    },
    SPELL_CLASSES: {
        BARD: 'Бард',
        CLERIC: 'Жрец',
        DRUID: 'Друид',
        PALADIN: 'Паладин',
        RANGER: 'Следопыт',
        SORCERER: 'Чародей',
        WARLOCK: 'Колдун',
        WIZARD: 'Волшебник',
        ARTIFICER: 'Изобретатель'
    },
    ACTION_TYPES: {
        ACTION: 'Действие',
        BONUS_ACTION: 'Бонусное действие',
        REACTION: 'Реакция',
        MINUTE: '1 минута',
        HOUR: '1 час'
    }
} as const;

export type GameDataKey = keyof typeof GAME_DATA_EN;
export type CreatureTypeKey = keyof typeof GAME_DATA_EN.CREATURE_TYPES;
export type SizeKey = keyof typeof GAME_DATA_EN.SIZES;
export type AlignmentKey = keyof typeof GAME_DATA_EN.ALIGNMENTS;
export type DamageTypeKey = keyof typeof GAME_DATA_EN.DAMAGE_TYPES;
export type ConditionKey = keyof typeof GAME_DATA_EN.CONDITIONS;
export type ConditionDescriptionKey = keyof typeof GAME_DATA_EN.CONDITION_DESCRIPTIONS;
export type SpellSchoolKey = keyof typeof GAME_DATA_EN.SPELL_SCHOOLS;
export type SpellClassKey = keyof typeof GAME_DATA_EN.SPELL_CLASSES;
export type ActionTypeKey = keyof typeof GAME_DATA_EN.ACTION_TYPES;