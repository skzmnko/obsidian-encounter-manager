import { Setting } from 'obsidian';

export class AbilityScoresComponent {
    private characteristics: number[] = [10, 10, 10, 10, 10, 10];
    private saving_throws_proficiency: boolean[] = [false, false, false, false, false, false];
    private proficiency_bonus: number = 2;
    private initiativeInput: HTMLInputElement | null = null;
    private onAbilityChangeCallback: (() => void) | null = null;

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        this.renderAbilities(section);
        this.renderSavingThrows(section);
        this.renderInitiative(section);
    }

    private renderAbilities(container: HTMLElement) {
        container.createEl('h3', { text: 'Характеристики' });

        const abilitiesContainer = container.createDiv({ cls: 'abilities-horizontal-container' });

        const abilities = [
            { index: 0, label: 'СИЛ', fullName: 'Сила' },
            { index: 1, label: 'ЛОВ', fullName: 'Ловкость' },
            { index: 2, label: 'ТЕЛ', fullName: 'Телосложение' },
            { index: 3, label: 'ИНТ', fullName: 'Интеллект' },
            { index: 4, label: 'МДР', fullName: 'Мудрость' },
            { index: 5, label: 'ХАР', fullName: 'Харизма' }
        ];

        abilities.forEach(ability => this.renderAbilityColumn(abilitiesContainer, ability));
    }

    private renderAbilityColumn(container: HTMLElement, ability: any) {
        const abilityCol = container.createDiv({ cls: 'ability-column' });

        abilityCol.createEl('div', { 
            text: ability.label,
            cls: 'ability-label'
        });

        const input = abilityCol.createEl('input', {
            type: 'text',
            value: this.characteristics[ability.index].toString(),
            cls: 'ability-input'
        });

        input.title = ability.fullName;

        const modifierInput = abilityCol.createEl('input', {
            type: 'text',
            value: this.formatModifier(this.calculateModifier(this.characteristics[ability.index])),
            cls: 'ability-modifier-input'
        });

        modifierInput.setAttr('readonly', 'true');
        modifierInput.title = `Модификатор ${ability.fullName}`;

        const updateModifier = () => {
            const value = input.value;
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                this.characteristics[ability.index] = numValue;
                const modifier = this.calculateModifier(numValue);
                modifierInput.value = this.formatModifier(modifier);
                
                // Уведомляем об изменении характеристики
                if (this.onAbilityChangeCallback) {
                    this.onAbilityChangeCallback();
                }
                
                // Если изменилась ловкость, обновляем инициативу
                if (ability.index === 1) {
                    this.updateInitiative();
                }
            }
        };

        input.addEventListener('input', updateModifier);

        input.addEventListener('blur', (e) => {
            const value = (e.target as HTMLInputElement).value;
            const numValue = Number(value);
            if (isNaN(numValue) || value.trim() === '') {
                this.characteristics[ability.index] = 10;
                (e.target as HTMLInputElement).value = '10';
                const modifier = this.calculateModifier(10);
                modifierInput.value = this.formatModifier(modifier);
                
                // Уведомляем об изменении характеристики
                if (this.onAbilityChangeCallback) {
                    this.onAbilityChangeCallback();
                }
                
                // Если изменилась ловкость, обновляем инициативу
                if (ability.index === 1) {
                    this.updateInitiative();
                }
            }
        });
    }

    private renderSavingThrows(container: HTMLElement) {
        const savingThrowsHeader = container.createEl('h3', { 
            text: 'Спасброски',
            cls: 'saving-throws-header'
        });
        savingThrowsHeader.style.textAlign = 'center';
        savingThrowsHeader.style.marginTop = '20px';

        const savingThrowsContainer = container.createDiv({ cls: 'saving-throws-container' });

        const savingThrows = [
            { index: 0, label: 'СИЛ', fullName: 'Спасбросок силы' },
            { index: 1, label: 'ЛОВ', fullName: 'Спасбросок ловкости' },
            { index: 2, label: 'ТЕЛ', fullName: 'Спасбросок телосложения' },
            { index: 3, label: 'ИНТ', fullName: 'Спасбросок интеллекта' },
            { index: 4, label: 'МДР', fullName: 'Спасбросок мудрости' },
            { index: 5, label: 'ХАР', fullName: 'Спасбросок харизмы' }
        ];

        savingThrows.forEach(savingThrow => {
            const savingThrowCol = savingThrowsContainer.createDiv({ cls: 'saving-throw-column' });

            savingThrowCol.createEl('div', { 
                text: savingThrow.label,
                cls: 'saving-throw-label'
            });

            const savingThrowInput = savingThrowCol.createEl('input', {
                type: 'text',
                value: this.formatModifier(this.calculateSavingThrowValue(savingThrow.index)),
                cls: 'saving-throw-input'
            });

            savingThrowInput.setAttr('readonly', 'true');
            savingThrowInput.title = savingThrow.fullName;

            savingThrowInput.addEventListener('click', () => {
                this.toggleSavingThrowProficiency(savingThrow.index, savingThrowInput);
            });

            const hint = savingThrowCol.createEl('div', {
                text: 'клик',
                cls: 'saving-throw-hint'
            });
        });
    }

    private renderInitiative(container: HTMLElement) {
        new Setting(container)
            .setName('Инициатива')
            .setDesc('Бонус инициативы (рассчитывается автоматически как модификатор ловкости)')
            .addText(text => {
                this.initiativeInput = text.inputEl;
                text.setPlaceholder('+0')
                    .setValue(this.formatModifier(this.getInitiative()))
                    .setDisabled(true);
            });
    }

    private toggleSavingThrowProficiency(abilityIndex: number, inputElement: HTMLInputElement) {
        this.saving_throws_proficiency[abilityIndex] = !this.saving_throws_proficiency[abilityIndex];
        
        if (this.saving_throws_proficiency[abilityIndex]) {
            inputElement.addClass('saving-throw-active');
            inputElement.title += ' (владение)';
        } else {
            inputElement.removeClass('saving-throw-active');
            inputElement.title = inputElement.title.replace(' (владение)', '');
        }
        
        inputElement.value = this.formatModifier(this.calculateSavingThrowValue(abilityIndex));
    }

    calculateSavingThrows(): number[] {
        return this.characteristics.map((abilityScore, index) => {
            const baseModifier = this.calculateModifier(abilityScore);
            if (this.saving_throws_proficiency[index]) {
                return baseModifier + this.proficiency_bonus;
            }
            return baseModifier;
        });
    }

    private calculateSavingThrowValue(abilityIndex: number): number {
        const baseModifier = this.calculateModifier(this.characteristics[abilityIndex]);
        if (this.saving_throws_proficiency[abilityIndex]) {
            return baseModifier + this.proficiency_bonus;
        }
        return baseModifier;
    }

    private calculateModifier(abilityScore: number): number {
        return Math.floor((abilityScore - 10) / 2);
    }

    private formatModifier(modifier: number): string {
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }

    getInitiative(): number {
        return this.calculateModifier(this.characteristics[1]); // Ловкость (индекс 1)
    }

    updateInitiative(): void {
        if (this.initiativeInput) {
            this.initiativeInput.value = this.formatModifier(this.getInitiative());
        }
    }

    // Колбэк для изменения характеристик
    onAbilityChange(callback: () => void) {
        this.onAbilityChangeCallback = callback;
    }

    // Геттеры и сеттеры
    getCharacteristics(): number[] { return this.characteristics; }
    getSavingThrowsProficiency(): boolean[] { return this.saving_throws_proficiency; }
    setProficiencyBonus(bonus: number) { 
        this.proficiency_bonus = bonus; 
        // Обновляем отображение спасбросков при изменении бонуса мастерства
        this.updateSavingThrowsDisplay();
    }

    private updateSavingThrowsDisplay() {
        const savingThrowInputs = document.querySelectorAll('.saving-throw-input');
        savingThrowInputs.forEach((input, index) => {
            if (index < this.saving_throws_proficiency.length) {
                (input as HTMLInputElement).value = this.formatModifier(this.calculateSavingThrowValue(index));
            }
        });
    }
}