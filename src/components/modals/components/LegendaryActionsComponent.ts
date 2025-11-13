import { Setting, Notice } from 'obsidian';
import { CreatureAction } from 'src/models/Bestiary';

export class LegendaryActionsComponent {
    private legendary_actions: CreatureAction[] = [];
    private newLegendaryActionName: string = '';
    private newLegendaryActionDesc: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Легендарные действия' });

        this.renderAddLegendaryActionForm(section);
        this.renderLegendaryActionsList(section);
    }

    private renderAddLegendaryActionForm(container: HTMLElement) {
        const addLegendaryActionContainer = container.createDiv({ cls: 'add-action-container' });
        
        new Setting(addLegendaryActionContainer)
            .setName('Название легендарного действия')
            .setDesc('Название легендарного действия')
            .addText(text => text
                .setPlaceholder('Дыхание дракона')
                .onChange(value => this.newLegendaryActionName = value));

        new Setting(addLegendaryActionContainer)
            .setName('Описание легендарного действия')
            .setDesc('Подробное описание легендарного действия и его эффектов')
            .addTextArea(text => text
                .setPlaceholder('Существо может совершить одно легендарное действие в конце хода другого существа...')
                .onChange(value => this.newLegendaryActionDesc = value));

        new Setting(addLegendaryActionContainer)
            .addButton(btn => btn
                .setButtonText('Добавить легендарное действие')
                .setCta()
                .onClick(() => {
                    if (!this.newLegendaryActionName.trim()) {
                        new Notice('Пожалуйста, введите название легендарного действия');
                        return;
                    }

                    if (this.legendary_actions.length >= 10) {
                        new Notice('Достигнуто максимальное количество легендарных действий (10)');
                        return;
                    }

                    const newLegendaryAction: CreatureAction = {
                        name: this.newLegendaryActionName,
                        desc: this.newLegendaryActionDesc
                    };

                    this.legendary_actions.push(newLegendaryAction);
                    
                    this.newLegendaryActionName = '';
                    this.newLegendaryActionDesc = '';
                    
                    const nameInput = addLegendaryActionContainer.querySelector('input[placeholder="Дыхание дракона"]') as HTMLInputElement;
                    const descInput = addLegendaryActionContainer.querySelector('textarea') as HTMLTextAreaElement;
                    if (nameInput) nameInput.value = '';
                    if (descInput) descInput.value = '';

                    this.updateLegendaryActionsList(container);
                    new Notice(`Легендарное действие "${newLegendaryAction.name}" добавлено`);
                }));
    }

    private renderLegendaryActionsList(container: HTMLElement) {
        const legendaryActionsListContainer = container.createDiv({ cls: 'actions-list-container' });
        legendaryActionsListContainer.createEl('div', { 
            text: 'Добавленные легендарные действия:',
            cls: 'actions-list-title'
        });
        
        const legendaryActionsListEl = legendaryActionsListContainer.createDiv({ 
            cls: 'actions-list',
            attr: { id: 'legendary-actions-list' }
        });
        
        this.updateLegendaryActionsList(container);
    }

    private updateLegendaryActionsList(container: HTMLElement) {
        const legendaryActionsListEl = container.querySelector('#legendary-actions-list');
        if (!legendaryActionsListEl) return;
        
        legendaryActionsListEl.empty();
        
        if (this.legendary_actions.length === 0) {
            legendaryActionsListEl.createEl('div', { 
                text: 'Легендарные действия не добавлены',
                cls: 'actions-empty'
            });
            return;
        }
        
        this.legendary_actions.forEach((legendaryAction, index) => {
            const legendaryActionItem = legendaryActionsListEl.createDiv({ cls: 'action-item' });
            
            const legendaryActionHeader = legendaryActionItem.createDiv({ cls: 'action-header' });
            legendaryActionHeader.createEl('strong', { text: legendaryAction.name });
            
            const legendaryActionDesc = legendaryActionItem.createDiv({ cls: 'action-desc' });
            legendaryActionDesc.setText(legendaryAction.desc);
            
            const removeBtn = legendaryActionItem.createEl('button', {
                text: 'Удалить',
                cls: 'action-remove mod-warning'
            });
            
            removeBtn.addEventListener('click', () => {
                this.legendary_actions.splice(index, 1);
                this.updateLegendaryActionsList(container);
                new Notice(`Легендарное действие "${legendaryAction.name}" удалено`);
            });
        });
    }

    // Геттеры
    getLegendaryActions(): CreatureAction[] { return this.legendary_actions; }
}