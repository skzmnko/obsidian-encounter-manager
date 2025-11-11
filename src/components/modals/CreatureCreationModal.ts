import { App, Modal, Setting, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';

export class CreatureCreationModal extends Modal {
    bestiaryService: any;
    onSave: (creature: Creature) => void;
    
    // Поля существа
    name: string = '';
    type: string = '';
    size: string = 'Средний';
    alignment: string = 'Без мировоззрения';
    ac: number = 13;
    hp: number = 30;
    speed: string = '30 футов';
    str: number = 10;
    dex: number = 10;
    con: number = 10;
    int: number = 10;
    wis: number = 10;
    cha: number = 10;
    skills: string = '';
    senses: string = '';
    languages: string = '';
    habitat: string = '';
    traits: string = '';
    actions: string = '';
    legendaryActions: string = '';
    notes: string = '';

    constructor(app: App, bestiaryService: any, onSave: (creature: Creature) => void) {
        super(app);
        this.bestiaryService = bestiaryService;
        this.onSave = onSave;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Добавить существо в бестиарий' });

        // Основные характеристики
        this.renderBasicFields(contentEl);
        
        // Характеристики
        this.renderAbilityScores(contentEl);
        
        // Дополнительные поля
        this.renderAdditionalFields(contentEl);

        // Кнопки
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Сохранить')
                .setCta()
                .onClick(async () => {
                    if (!this.name.trim()) {
                        new Notice('Пожалуйста, введите имя существа');
                        return;
                    }

                    const creatureData: Omit<Creature, 'id' | 'created' | 'updated'> = {
                        name: this.name,
                        type: this.type,
                        size: this.size,
                        alignment: this.alignment,
                        ac: this.ac,
                        hp: this.hp,
                        speed: this.speed,
                        str: this.str,
                        dex: this.dex,
                        con: this.con,
                        int: this.int,
                        wis: this.wis,
                        cha: this.cha,
                        skills: this.skills,
                        senses: this.senses,
                        languages: this.languages,
                        habitat: this.habitat,
                        traits: this.traits,
                        actions: this.actions,
                        legendaryActions: this.legendaryActions,
                        notes: this.notes
                    };

                    try {
                        console.log('Creating creature:', creatureData.name);
                        const creature = await this.bestiaryService.createCreature(creatureData);
                        this.onSave(creature);
                        this.close();
                        new Notice(`Существо "${creature.name}" добавлено в бестиарий!`);
                    } catch (error) {
                        console.error('Error creating creature:', error);
                        // Более понятное сообщение для пользователя
                        if (error.message.includes('already exists')) {
                            new Notice('Ошибка: проблема с файловой системой. Попробуйте еще раз.');
                        } else {
                            new Notice('Ошибка при сохранении существа: ' + error.message);
                        }
                    }
                }))
            .addButton(btn => btn
                .setButtonText('Отмена')
                .onClick(() => {
                    this.close();
                }));
    }

    renderBasicFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Основные характеристики' });

        new Setting(contentEl)
            .setName('Имя')
            .setDesc('Название существа')
            .addText(text => text
                .setPlaceholder('Древний красный дракон')
                .onChange(value => this.name = value));

        new Setting(contentEl)
            .setName('Тип')
            .setDesc('Тип существа (дракон, гуманоид, зверь и т.д.)')
            .addText(text => text
                .setPlaceholder('Дракон')
                .onChange(value => this.type = value));

        new Setting(contentEl)
            .setName('Размер')
            .setDesc('Размер существа')
            .addDropdown(dropdown => dropdown
                .addOption('Tiny', 'Крошечный')
                .addOption('Small', 'Малый')
                .addOption('Medium', 'Средний')
                .addOption('Large', 'Большой')
                .addOption('Huge', 'Огромный')
                .addOption('Gargantuan', 'Громадный')
                .setValue(this.size)
                .onChange(value => this.size = value));

        new Setting(contentEl)
            .setName('Мировоззрение')
            .setDesc('Мировоззрение существа')
            .addDropdown(dropdown => dropdown
                .addOption('Без мировоззрения', 'Без мировоззрения')
                .addOption('Законно-Доброе', 'Законно-Доброе')
                .addOption('Нейтрально-Доброе', 'Нейтрально-Доброе')
                .addOption('Хаотично-Доброе', 'Хаотично-Доброе')
                .addOption('Законно-Нейтральное', 'Законно-Нейтральное')
                .addOption('Истинно-Нейтральное', 'Истинно-Нейтральное')
                .addOption('Хаотично-Нейтральное', 'Хаотично-Нейтральное')
                .addOption('Законно-Злое', 'Законно-Злое')
                .addOption('Нейтрально-Злое', 'Нейтрально-Злое')
                .addOption('Хаотично-Злое', 'Хаотично-Злое')
                .setValue(this.alignment)
                .onChange(value => this.alignment = value));

        new Setting(contentEl)
            .setName('Класс брони (AC)')
            .setDesc('Класс брони')
            .addText(text => text
                .setPlaceholder('13')
                .setValue(this.ac.toString())
                .onChange(value => this.ac = Number(value) || 13));

        new Setting(contentEl)
            .setName('Хиты (HP)')
            .setDesc('Хиты существа')
            .addText(text => text
                .setPlaceholder('30')
                .setValue(this.hp.toString())
                .onChange(value => this.hp = Number(value) || 30));

        new Setting(contentEl)
            .setName('Скорость')
            .setDesc('Скорость перемещения')
            .addText(text => text
                .setPlaceholder('30 ft., fly 60 ft.')
                .setValue(this.speed)
                .onChange(value => this.speed = value));

        new Setting(contentEl)
            .setName('Место обитания')
            .setDesc('Типичная среда обитания существа')
            .addText(text => text
                .setPlaceholder('Горы, леса, подземелья...')
                .setValue(this.habitat)
                .onChange(value => this.habitat = value));
    }

    renderAbilityScores(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Характеристики' });

        // Используем интерфейс для типизации
        interface AbilityField {
            key: keyof CreatureCreationModal;
            label: string;
        }

        const abilities: AbilityField[] = [
            { key: 'str', label: 'Сила (STR)' },
            { key: 'dex', label: 'Ловкость (DEX)' },
            { key: 'con', label: 'Телосложение (CON)' },
            { key: 'int', label: 'Интеллект (INT)' },
            { key: 'wis', label: 'Мудрость (WIS)' },
            { key: 'cha', label: 'Харизма (CHA)' }
        ];

        abilities.forEach(ability => {
            new Setting(contentEl)
                .setName(ability.label)
                .addText(text => text
                    .setValue((this[ability.key] as number).toString())
                    .onChange(value => {
                        // Используем type assertion для безопасности
                        (this[ability.key] as number) = Number(value) || 10;
                    }));
        });
    }

    renderAdditionalFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Дополнительные характеристики' });

        new Setting(contentEl)
            .setName('Навыки')
            .setDesc('Навыки существа')
            .addTextArea(text => text
                .setPlaceholder('Восприятие +2, Скрытность +4')
                .setValue(this.skills)
                .onChange(value => this.skills = value));

        new Setting(contentEl)
            .setName('Чувства')
            .setDesc('Особые чувства')
            .addTextArea(text => text
                .setPlaceholder('Тёмное зрение 60 ft., пассивное Восприятие 12')
                .setValue(this.senses)
                .onChange(value => this.senses = value));

        new Setting(contentEl)
            .setName('Языки')
            .setDesc('Известные языки')
            .addTextArea(text => text
                .setPlaceholder('Общий, Драконий')
                .setValue(this.languages)
                .onChange(value => this.languages = value));

        new Setting(contentEl)
            .setName('Черты')
            .setDesc('Особые черты и способности')
            .addTextArea(text => text
                .setPlaceholder('Сопротивление огню, Легендарное сопротивление (3/день)')
                .setValue(this.traits)
                .onChange(value => this.traits = value));

        new Setting(contentEl)
            .setName('Действия')
            .setDesc('Боевые действия')
            .addTextArea(text => text
                .setPlaceholder('Укус: +5 к попаданию, 10 (2к6 + 3) колющего урона')
                .setValue(this.actions)
                .onChange(value => this.actions = value));

        new Setting(contentEl)
            .setName('Легендарные действия')
            .setDesc('Легендарные действия')
            .addTextArea(text => text
                .setPlaceholder('Существо может совершить 3 легендарных действия...')
                .setValue(this.legendaryActions)
                .onChange(value => this.legendaryActions = value));

        new Setting(contentEl)
            .setName('Заметки')
            .setDesc('Дополнительные заметки')
            .addTextArea(text => text
                .setPlaceholder('Особое поведение, тактика боя и т.д.')
                .setValue(this.notes)
                .onChange(value => this.notes = value));
    }
}