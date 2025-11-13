import { Setting, Notice } from 'obsidian';
import { DAMAGE_TYPES, CONDITION_NAMES, DamageType } from 'src/constants/Constants';

export class ImmunitiesComponent {
    private damage_resistances: string[] = [];
    private damage_vulnerabilities: string[] = [];
    private damage_immunities: string[] = [];
    private condition_immunities: string[] = [];

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Иммунитеты и сопротивления' });

        this.renderDamageResistances(section);
        this.renderDamageVulnerabilities(section);
        this.renderDamageImmunities(section);
        this.renderConditionImmunities(section);
    }

    private renderDamageResistances(container: HTMLElement) {
        new Setting(container)
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
                        this.updateSelectedValues(container, 'damage-resistances-list', this.damage_resistances);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'damage-resistances-list', 'Выбранные сопротивления:', this.damage_resistances);
    }

    private renderDamageVulnerabilities(container: HTMLElement) {
        new Setting(container)
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
                        this.updateSelectedValues(container, 'damage-vulnerabilities-list', this.damage_vulnerabilities);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'damage-vulnerabilities-list', 'Выбранные уязвимости:', this.damage_vulnerabilities);
    }

    private renderDamageImmunities(container: HTMLElement) {
        new Setting(container)
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
                        this.updateSelectedValues(container, 'damage-immunities-list', this.damage_immunities);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'damage-immunities-list', 'Выбранные иммунитеты к урону:', this.damage_immunities);
    }

    private renderConditionImmunities(container: HTMLElement) {
        new Setting(container)
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
                        this.updateSelectedValues(container, 'condition-immunities-list', this.condition_immunities);
                    }
                    dropdown.setValue('');
                });
            });

        this.renderSelectedValuesList(container, 'condition-immunities-list', 'Выбранные иммунитеты к состояниям:', this.condition_immunities);
    }

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
        
        this.updateSelectedValues(container, listId, values);
    }

    private updateSelectedValues(container: HTMLElement, listId: string, values: string[]) {
        const listEl = container.querySelector(`#${listId}`);
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
                this.updateSelectedValues(container, listId, values);
            });
        });
    }

    // Геттеры
    getDamageResistances(): string[] { return this.damage_resistances; }
    getDamageVulnerabilities(): string[] { return this.damage_vulnerabilities; }
    getDamageImmunities(): string[] { return this.damage_immunities; }
    getConditionImmunities(): string[] { return this.condition_immunities; }
}