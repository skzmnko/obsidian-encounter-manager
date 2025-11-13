import { App, Modal, Setting, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { DAMAGE_TYPES, CONDITION_NAMES, CREATURE_SIZES, ALIGNMENTS, DamageType } from 'src/constants/Constants';

export class CreatureCreationModal extends Modal {
    bestiaryService: any;
    onSave: (creature: Creature) => void;
    
    // Поля существа
    name: string = '';
    type: string = '';
    size: string = 'Medium';
    alignment: string = 'Без мировоззрения';
    ac: number = 13;
    hit_dice: string = '8d8+24';
    speed: string = '30 футов';
    initiative: number = 0;
    proficiency_bonus: number = 2;
    characteristics: number[] = [10, 10, 10, 10, 10, 10];
    saving_throws_proficiency: boolean[] = [false, false, false, false, false, false];
    skills: string = '';
    damage_resistances: string[] = [];
    damage_vulnerabilities: string[] = [];
    damage_immunities: string[] = [];
    condition_immunities: string[] = [];
    senses: string = '';
    languages: string = '';
    habitat: string = '';
    traits: string = '';
    actions: string = '';
    legendaryActions: string = '';
    notes: string = '';

    private initiativeInput: HTMLInputElement | null = null;

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
        
        // Характеристики - теперь с модификаторами
        this.renderHorizontalAbilityScores(contentEl);
        
        // Спасброски - новый блок
        this.renderSavingThrows(contentEl);
        
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

                    // Вычисляем числовые значения спасбросков перед сохранением
                    const saving_throws = this.calculateSavingThrows();

                    const creatureData: Omit<Creature, 'id' | 'created' | 'updated'> = {
                        name: this.name,
                        type: this.type,
                        size: this.size,
                        alignment: this.alignment,
                        ac: this.ac,
                        hit_dice: this.hit_dice,
                        speed: this.speed,
                        initiative: this.initiative,
                        proficiency_bonus: this.proficiency_bonus,
                        characteristics: this.characteristics,
                        saving_throws: saving_throws,
                        skills: this.skills,
                        damage_resistances: this.damage_resistances,
                        damage_vulnerabilities: this.damage_vulnerabilities,
                        damage_immunities: this.damage_immunities,
                        condition_immunities: this.condition_immunities,
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

    // НОВЫЙ МЕТОД: вычисление числовых значений спасбросков
    private calculateSavingThrows(): number[] {
        return this.characteristics.map((abilityScore, index) => {
            const baseModifier = this.calculateModifier(abilityScore);
            if (this.saving_throws_proficiency[index]) {
                return baseModifier + this.proficiency_bonus;
            }
            return baseModifier;
        });
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

        // Размер - ОБНОВЛЕНО: используем константы
        new Setting(contentEl)
            .setName('Размер')
            .setDesc('Размер существа')
            .addDropdown(dropdown => {
                // ОБНОВЛЕНО: используем константы из DnDConstants
                CREATURE_SIZES.forEach(size => {
                    dropdown.addOption(size.value, size.label);
                });
                dropdown.setValue(this.size)
                    .onChange(value => this.size = value);
            });

        // Мировоззрение - ОБНОВЛЕНО: используем константы
        new Setting(contentEl)
            .setName('Мировоззрение')
            .setDesc('Мировоззрение существа')
            .addDropdown(dropdown => {
                // ОБНОВЛЕНО: используем константы из DnDConstants
                ALIGNMENTS.forEach(alignment => {
                    dropdown.addOption(alignment.value, alignment.label);
                });
                dropdown.setValue(this.alignment)
                    .onChange(value => this.alignment = value);
            });

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
                .setPlaceholder('8d8+24')
                .setValue(this.hit_dice)
                .onChange(value => this.hit_dice = value));

        new Setting(contentEl)
            .setName('Скорость')
            .setDesc('Скорость перемещения')
            .addText(text => text
                .setPlaceholder('30 ft., fly 60 ft.')
                .setValue(this.speed)
                .onChange(value => this.speed = value));

        new Setting(contentEl)
            .setName('Инициатива')
            .setDesc('Бонус инициативы (рассчитывается автоматически как модификатор ловкости)')
            .addText(text => {
                this.initiativeInput = text.inputEl;
                text.setPlaceholder('+0')
                    .setValue(this.formatModifier(this.calculateInitiative()))
                    .setDisabled(true);
                this.initiative = this.calculateInitiative();
            });
        
        new Setting(contentEl)
            .setName('Бонус мастерства')
            .setDesc('Бонус мастерства существа')
            .addText(text => text
                .setPlaceholder('2')
                .setValue(this.proficiency_bonus.toString())
                .onChange(value => {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                        this.proficiency_bonus = numValue;
                        this.updateSavingThrowsFields();
                    }
                }));

        new Setting(contentEl)
            .setName('Место обитания')
            .setDesc('Типичная среда обитания существа')
            .addText(text => text
                .setPlaceholder('Горы, леса, подземелья...')
                .setValue(this.habitat)
                .onChange(value => this.habitat = value));
    }

    // Метод для расчета модификатора характеристики
    private calculateModifier(abilityScore: number): number {
        return Math.floor((abilityScore - 10) / 2);
    }

    // Метод для расчета инициативы (модификатор ловкости)
    private calculateInitiative(): number {
        const dexModifier = this.calculateModifier(this.characteristics[1]);
        return dexModifier;
    }

    // Метод для форматирования модификатора (с плюсом для положительных значений)
    private formatModifier(modifier: number): string {
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }

    // Метод для расчета значения спасброска (для отображения в UI)
    private calculateSavingThrowValue(abilityIndex: number): number {
        const baseModifier = this.calculateModifier(this.characteristics[abilityIndex]);
        if (this.saving_throws_proficiency[abilityIndex]) {
            return baseModifier + this.proficiency_bonus;
        }
        return baseModifier;
    }

    // ОБНОВЛЕННЫЙ МЕТОД: работа с массивом characteristics
    renderHorizontalAbilityScores(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Характеристики' });

        // Создаем контейнер для горизонтального расположения
        const abilitiesContainer = contentEl.createDiv({ 
            cls: 'abilities-horizontal-container' 
        });

        // Массив характеристик с русскими сокращениями и индексами
        const abilities = [
            { index: 0, label: 'СИЛ', fullName: 'Сила' },
            { index: 1, label: 'ЛОВ', fullName: 'Ловкость' },
            { index: 2, label: 'ТЕЛ', fullName: 'Телосложение' },
            { index: 3, label: 'ИНТ', fullName: 'Интеллект' },
            { index: 4, label: 'МДР', fullName: 'Мудрость' },
            { index: 5, label: 'ХАР', fullName: 'Харизма' }
        ];

        abilities.forEach(ability => {
            const abilityCol = abilitiesContainer.createDiv({ 
                cls: 'ability-column' 
            });

            // Заголовок колонки
            abilityCol.createEl('div', { 
                text: ability.label,
                cls: 'ability-label'
            });

            // Поле ввода значения характеристики
            const input = abilityCol.createEl('input', {
                type: 'text',
                value: this.characteristics[ability.index].toString(),
                cls: 'ability-input'
            });

            // Подсказка при наведении
            input.title = ability.fullName;

            // Поле для модификатора (readonly)
            const modifierInput = abilityCol.createEl('input', {
                type: 'text',
                value: this.formatModifier(this.calculateModifier(this.characteristics[ability.index])),
                cls: 'ability-modifier-input'
            });

            modifierInput.setAttr('readonly', 'true');
            modifierInput.title = `Модификатор ${ability.fullName}`;

            // Обработчик изменения значения характеристики
            const updateModifier = () => {
                const value = input.value;
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                    this.characteristics[ability.index] = numValue;
                    const modifier = this.calculateModifier(numValue);
                    modifierInput.value = this.formatModifier(modifier);

                    if (ability.index === 1) {
                        this.initiative = this.calculateInitiative();
                        this.updateInitiativeField();
                    }
                    
                    // Обновляем спасброски при изменении характеристик
                    this.updateSavingThrowsFields();
                }
            };

            input.addEventListener('input', updateModifier);

            // Валидация при потере фокуса
            input.addEventListener('blur', (e) => {
                const value = (e.target as HTMLInputElement).value;
                const numValue = Number(value);
                if (isNaN(numValue) || value.trim() === '') {
                    this.characteristics[ability.index] = 10;
                    (e.target as HTMLInputElement).value = '10';
                    const modifier = this.calculateModifier(10);
                    modifierInput.value = this.formatModifier(modifier);

                    if (ability.index === 1) {
                        this.initiative = this.calculateInitiative();
                        this.updateInitiativeField();
                    }
                    
                    // Обновляем спасброски при изменении характеристик
                    this.updateSavingThrowsFields();
                }
            });
        });

        // Добавляем CSS стили для горизонтального расположения
        this.addHorizontalAbilitiesStyles(contentEl);
    }

    // НОВЫЙ МЕТОД: рендер спасбросков
    renderSavingThrows(contentEl: HTMLElement) {
        // Заголовок
        const savingThrowsHeader = contentEl.createEl('h3', { 
            text: 'Спасброски',
            cls: 'saving-throws-header'
        });
        savingThrowsHeader.style.textAlign = 'center';
        savingThrowsHeader.style.marginTop = '20px';

        // Контейнер для спасбросков
        const savingThrowsContainer = contentEl.createDiv({ 
            cls: 'saving-throws-container' 
        });

        // Массив спасбросков с русскими названиями
        const savingThrows = [
            { index: 0, label: 'СИЛ', fullName: 'Спасбросок силы' },
            { index: 1, label: 'ЛОВ', fullName: 'Спасбросок ловкости' },
            { index: 2, label: 'ТЕЛ', fullName: 'Спасбросок телосложения' },
            { index: 3, label: 'ИНТ', fullName: 'Спасбросок интеллекта' },
            { index: 4, label: 'МДР', fullName: 'Спасбросок мудрости' },
            { index: 5, label: 'ХАР', fullName: 'Спасбросок харизмы' }
        ];

        savingThrows.forEach(savingThrow => {
            const savingThrowCol = savingThrowsContainer.createDiv({ 
                cls: 'saving-throw-column' 
            });

            // Заголовок колонки
            savingThrowCol.createEl('div', { 
                text: savingThrow.label,
                cls: 'saving-throw-label'
            });

            // Поле для значения спасброска (readonly)
            const savingThrowInput = savingThrowCol.createEl('input', {
                type: 'text',
                value: this.formatModifier(this.calculateSavingThrowValue(savingThrow.index)),
                cls: 'saving-throw-input'
            });

            savingThrowInput.setAttr('readonly', 'true');
            savingThrowInput.title = savingThrow.fullName;

            // Обработчик клика - переключаем состояние владения спасброском
            savingThrowInput.addEventListener('click', () => {
                this.toggleSavingThrowProficiency(savingThrow.index, savingThrowInput);
            });

            // Добавляем подсказку о кликабельности
            const hint = savingThrowCol.createEl('div', {
                text: 'клик',
                cls: 'saving-throw-hint'
            });
        });

        // Добавляем CSS стили для спасбросков
        this.addSavingThrowsStyles(contentEl);
    }

    // Метод для переключения состояния владения спасброском
    private toggleSavingThrowProficiency(abilityIndex: number, inputElement: HTMLInputElement) {
        this.saving_throws_proficiency[abilityIndex] = !this.saving_throws_proficiency[abilityIndex];
        
        // Обновляем визуальное состояние
        if (this.saving_throws_proficiency[abilityIndex]) {
            inputElement.addClass('saving-throw-active');
            inputElement.title += ' (владение)';
        } else {
            inputElement.removeClass('saving-throw-active');
            inputElement.title = inputElement.title.replace(' (владение)', '');
        }
        
        // Обновляем значение
        inputElement.value = this.formatModifier(this.calculateSavingThrowValue(abilityIndex));
    }

    // Метод для обновления всех полей спасбросков
    private updateSavingThrowsFields() {
        const savingThrowInputs = this.containerEl.querySelectorAll('.saving-throw-input');
        savingThrowInputs.forEach((input, index) => {
            if (index < this.saving_throws_proficiency.length) {
                (input as HTMLInputElement).value = this.formatModifier(this.calculateSavingThrowValue(index));
            }
        });
    }

    private updateInitiativeField(): void {
        if (this.initiativeInput) {
            this.initiativeInput.value = this.formatModifier(this.initiative);
        }
    }

    // НОВЫЙ МЕТОД: рендер иммунитетов и сопротивлений
    renderImmunitiesAndResistances(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Иммунитеты и сопротивления' });

        // Сопротивления урону
        new Setting(contentEl)
            .setName('Сопротивления урону')
            .setDesc('Типы урона, к которым существо имеет сопротивление (половина урона)')
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', 'Выберите тип урона...');
                
                DAMAGE_TYPES.forEach((damageType: DamageType) => {
                    dropdown.addOption(damageType, damageType);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.damage_resistances.includes(value)) {
                        this.damage_resistances.push(value);
                        this.updateSelectedValues('damage-resistances-list', this.damage_resistances);
                    }
                    dropdown.setValue('');
                });
            });

        // Список выбранных сопротивлений
        this.renderSelectedValuesList(contentEl, 'damage-resistances-list', 'Выбранные сопротивления:', this.damage_resistances);

        // Уязвимости к урону
        new Setting(contentEl)
            .setName('Уязвимости к урону')
            .setDesc('Типы урона, к которым существо имеет уязвимость (двойной урон)')
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', 'Выберите тип урона...');
                
                DAMAGE_TYPES.forEach((damageType: DamageType) => {
                    dropdown.addOption(damageType, damageType);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.damage_vulnerabilities.includes(value)) {
                        this.damage_vulnerabilities.push(value);
                        this.updateSelectedValues('damage-vulnerabilities-list', this.damage_vulnerabilities);
                    }
                    dropdown.setValue('');
                });
            });

        // Список выбранных уязвимостей
        this.renderSelectedValuesList(contentEl, 'damage-vulnerabilities-list', 'Выбранные уязвимости:', this.damage_vulnerabilities);

        // Иммунитеты к урону
        new Setting(contentEl)
            .setName('Иммунитеты к урону')
            .setDesc('Типы урона, к которым существо имеет иммунитет (нулевой урон)')
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', 'Выберите тип урона...');
                
                DAMAGE_TYPES.forEach((damageType: DamageType) => {
                    dropdown.addOption(damageType, damageType);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.damage_immunities.includes(value)) {
                        this.damage_immunities.push(value);
                        this.updateSelectedValues('damage-immunities-list', this.damage_immunities);
                    }
                    dropdown.setValue('');
                });
            });

        // Список выбранных иммунитетов к урону
        this.renderSelectedValuesList(contentEl, 'damage-immunities-list', 'Выбранные иммунитеты к урону:', this.damage_immunities);

        // Иммунитеты к состояниям
        new Setting(contentEl)
            .setName('Иммунитеты к состояниям')
            .setDesc('Состояния, к которым существо имеет иммунитет')
            .addDropdown(dropdown => {
                dropdown.setDisabled(false);
                dropdown.addOption('', 'Выберите состояние...');
                
                CONDITION_NAMES.forEach((condition: string) => {
                    dropdown.addOption(condition, condition);
                });
                
                dropdown.onChange((value: string) => {
                    if (value && !this.condition_immunities.includes(value)) {
                        this.condition_immunities.push(value);
                        this.updateSelectedValues('condition-immunities-list', this.condition_immunities);
                    }
                    dropdown.setValue('');
                });
            });

        // Список выбранных иммунитетов к состояниям
        this.renderSelectedValuesList(contentEl, 'condition-immunities-list', 'Выбранные иммунитеты к состояниям:', this.condition_immunities);
    }

    // НОВЫЙ МЕТОД: рендер списка выбранных значений
    private renderSelectedValuesList(container: HTMLElement, listId: string, title: string, values: string[]) {
        const listContainer = container.createDiv({ cls: 'selected-values-container' });
        listContainer.createEl('div', { 
            text: title,
            cls: 'selected-values-title'
        });
        
        const listEl = listContainer.createDiv({ 
            cls: 'selected-values-list',
            attr: { id: listId }
        });
        
        this.updateSelectedValues(listId, values);
    }

    // НОВЫЙ МЕТОД: обновление списка выбранных значений
    private updateSelectedValues(listId: string, values: string[]) {
        const listEl = this.containerEl.querySelector(`#${listId}`);
        if (!listEl) return;
        
        listEl.empty();
        
        if (values.length === 0) {
            listEl.createEl('div', { 
                text: 'Не выбрано',
                cls: 'selected-values-empty'
            });
            return;
        }
        
        values.forEach((value, index) => {
            const valueItem = listEl.createDiv({ cls: 'selected-value-item' });
            valueItem.createEl('span', { text: value });
            
            const removeBtn = valueItem.createEl('button', {
                text: '×',
                cls: 'selected-value-remove'
            });
            
            removeBtn.addEventListener('click', () => {
                values.splice(index, 1);
                this.updateSelectedValues(listId, values);
            });
        });
    }

    // ОБНОВЛЕННЫЙ МЕТОД: рендер дополнительных полей
    renderAdditionalFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Дополнительные характеристики' });

        new Setting(contentEl)
            .setName('Навыки')
            .setDesc('Навыки существа')
            .addTextArea(text => text
                .setPlaceholder('Восприятие +2, Скрытность +4')
                .setValue(this.skills)
                .onChange(value => this.skills = value));

        // Новые поля иммунитетов и сопротивлений
        this.renderImmunitiesAndResistances(contentEl);

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

        // Добавляем CSS стили для новых элементов
        this.addImmunitiesStyles(contentEl);
    }

    // Метод для добавления CSS стилей характеристик
    private addHorizontalAbilitiesStyles(contentEl: HTMLElement) {
        const style = contentEl.createEl('style');
        style.textContent = `
            .abilities-horizontal-container {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .ability-column {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                min-width: 60px;
            }
            
            .ability-label {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 5px;
                color: var(--text-normal);
            }
            
            .ability-input {
                width: 100%;
                text-align: center;
                padding: 5px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                background: var(--background-primary);
                color: var(--text-normal);
                margin-bottom: 3px;
            }
            
            .ability-input:focus {
                border-color: var(--interactive-accent);
                outline: none;
            }
            
            .ability-modifier-input {
                width: 100%;
                text-align: center;
                padding: 5px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                background: var(--background-secondary);
                color: var(--text-muted);
                font-style: italic;
                cursor: not-allowed;
            }
            
            .ability-modifier-input:focus {
                outline: none;
            }
            
            .ability-modifier-input[readonly] {
                background: var(--background-secondary);
                color: var(--text-muted);
            }
        `;
    }

    // НОВЫЙ МЕТОД: добавление CSS стилей для спасбросков
    private addSavingThrowsStyles(contentEl: HTMLElement) {
        const style = contentEl.createEl('style');
        style.textContent = `
            .saving-throws-container {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .saving-throw-column {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                min-width: 60px;
            }
            
            .saving-throw-label {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 5px;
                color: var(--text-normal);
            }
            
            .saving-throw-input {
                width: 100%;
                text-align: center;
                padding: 5px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                background: var(--background-secondary);
                color: var(--text-normal);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .saving-throw-input:hover {
                background: var(--background-modifier-hover);
            }
            
            .saving-throw-input.saving-throw-active {
                background: var(--interactive-accent);
                color: var(--text-on-accent);
                border-color: var(--interactive-accent-hover);
                font-weight: bold;
            }
            
            .saving-throw-hint {
                font-size: 10px;
                color: var(--text-muted);
                margin-top: 2px;
                font-style: italic;
            }
            
            .saving-throw-input[readonly] {
                cursor: pointer;
            }
        `;
    }

    // НОВЫЙ МЕТОД: добавление CSS стилей для иммунитетов
    private addImmunitiesStyles(contentEl: HTMLElement) {
        const style = contentEl.createEl('style');
        style.textContent = `
            .selected-values-container {
                margin-bottom: 15px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                padding: 10px;
                background: var(--background-secondary);
            }
            
            .selected-values-title {
                font-weight: bold;
                margin-bottom: 8px;
                color: var(--text-normal);
                font-size: 14px;
            }
            
            .selected-values-list {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .selected-value-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 8px;
                background: var(--background-primary);
                border-radius: 3px;
                border: 1px solid var(--background-modifier-border);
            }
            
            .selected-value-remove {
                background: var(--background-modifier-error);
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .selected-value-remove:hover {
                background: var(--background-modifier-error-hover);
            }
            
            .selected-values-empty {
                color: var(--text-muted);
                font-style: italic;
                text-align: center;
                padding: 10px;
            }
        `;
    }
}