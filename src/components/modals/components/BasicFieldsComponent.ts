import { Setting } from 'obsidian';
import { CREATURE_SIZES, ALIGNMENTS } from 'src/constants/Constants';

export class BasicFieldsComponent {
    private name: string = '';
    private type: string = '';
    private size: string = 'Medium';
    private alignment: string = 'Без мировоззрения';
    private ac: number = 13;
    private hit_dice: string = '8d8+24';
    private speed: string = '30 футов';
    private proficiency_bonus: number = 2;
    private habitat: string = '';
    private onProficiencyBonusChangeCallback: ((bonus: number) => void) | null = null;

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Основные характеристики' });

        new Setting(section)
            .setName('Имя')
            .setDesc('Название существа')
            .addText(text => text
                .setPlaceholder('Древний красный дракон')
                .onChange(value => this.name = value));

        new Setting(section)
            .setName('Тип')
            .setDesc('Тип существа (дракон, гуманоид, зверь и т.д.)')
            .addText(text => text
                .setPlaceholder('Дракон')
                .onChange(value => this.type = value));

        new Setting(section)
            .setName('Размер')
            .setDesc('Размер существа')
            .addDropdown(dropdown => {
                CREATURE_SIZES.forEach(size => {
                    dropdown.addOption(size.value, size.label);
                });
                dropdown.setValue(this.size)
                    .onChange(value => this.size = value);
            });

        new Setting(section)
            .setName('Мировоззрение')
            .setDesc('Мировоззрение существа')
            .addDropdown(dropdown => {
                ALIGNMENTS.forEach(alignment => {
                    dropdown.addOption(alignment.value, alignment.label);
                });
                dropdown.setValue(this.alignment)
                    .onChange(value => this.alignment = value);
            });

        new Setting(section)
            .setName('Класс брони (AC)')
            .setDesc('Класс брони')
            .addText(text => text
                .setPlaceholder('13')
                .setValue(this.ac.toString())
                .onChange(value => this.ac = Number(value) || 13));

        new Setting(section)
            .setName('Хиты (HP)')
            .setDesc('Хиты существа')
            .addText(text => text
                .setPlaceholder('8d8+24')
                .setValue(this.hit_dice)
                .onChange(value => this.hit_dice = value));

        new Setting(section)
            .setName('Скорость')
            .setDesc('Скорость перемещения')
            .addText(text => text
                .setPlaceholder('30 ft., fly 60 ft.')
                .setValue(this.speed)
                .onChange(value => this.speed = value));

        new Setting(section)
            .setName('Бонус мастерства')
            .setDesc('Бонус мастерства существа')
            .addText(text => text
                .setPlaceholder('2')
                .setValue(this.proficiency_bonus.toString())
                .onChange(value => {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                        this.proficiency_bonus = numValue;
                        // Уведомляем об изменении бонуса мастерства
                        if (this.onProficiencyBonusChangeCallback) {
                            this.onProficiencyBonusChangeCallback(numValue);
                        }
                    }
                }));

        new Setting(section)
            .setName('Место обитания')
            .setDesc('Типичная среда обитания существа')
            .addText(text => text
                .setPlaceholder('Горы, леса, подземелья...')
                .setValue(this.habitat)
                .onChange(value => this.habitat = value));
    }

    // Колбэк для изменения бонуса мастерства
    onProficiencyBonusChange(callback: (bonus: number) => void) {
        this.onProficiencyBonusChangeCallback = callback;
    }

    // Геттеры
    getName(): string { return this.name; }
    getType(): string { return this.type; }
    getSize(): string { return this.size; }
    getAlignment(): string { return this.alignment; }
    getAC(): number { return this.ac; }
    getHitDice(): string { return this.hit_dice; }
    getSpeed(): string { return this.speed; }
    getProficiencyBonus(): number { return this.proficiency_bonus; }
    getHabitat(): string { return this.habitat; }
}