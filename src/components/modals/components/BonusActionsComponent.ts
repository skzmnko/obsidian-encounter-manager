import { Setting, Notice } from 'obsidian';
import { CreatureAction } from 'src/models/Bestiary';

export class BonusActionsComponent {
    private bonus_actions: CreatureAction[] = [];
    private newBonusActionName: string = '';
    private newBonusActionDesc: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Бонусные действия' });

        this.renderAddBonusActionForm(section);
        this.renderBonusActionsList(section);
    }

    private renderAddBonusActionForm(container: HTMLElement) {
        const addBonusActionContainer = container.createDiv({ cls: 'add-action-container' });
        
        new Setting(addBonusActionContainer)
            .setName('Название бонусного действия')
            .setDesc('Название бонусного действия')
            .addText(text => text
                .setPlaceholder('Быстрое заклинание')
                .onChange(value => this.newBonusActionName = value));

        new Setting(addBonusActionContainer)
            .setName('Описание бонусного действия')
            .setDesc('Подробное описание бонусного действия и его эффектов')
            .addTextArea(text => text
                .setPlaceholder('Существо может совершить одно бонусное действие...')
                .onChange(value => this.newBonusActionDesc = value));

        new Setting(addBonusActionContainer)
            .addButton(btn => btn
                .setButtonText('Добавить бонусное действие')
                .setCta()
                .onClick(() => {
                    if (!this.newBonusActionName.trim()) {
                        new Notice('Пожалуйста, введите название бонусного действия');
                        return;
                    }

                    if (this.bonus_actions.length >= 10) {
                        new Notice('Достигнуто максимальное количество бонусных действий (10)');
                        return;
                    }

                    const newBonusAction: CreatureAction = {
                        name: this.newBonusActionName,
                        desc: this.newBonusActionDesc
                    };

                    this.bonus_actions.push(newBonusAction);
                    
                    this.newBonusActionName = '';
                    this.newBonusActionDesc = '';
                    
                    const nameInput = addBonusActionContainer.querySelector('input[placeholder="Быстрое заклинание"]') as HTMLInputElement;
                    const descInput = addBonusActionContainer.querySelector('textarea') as HTMLTextAreaElement;
                    if (nameInput) nameInput.value = '';
                    if (descInput) descInput.value = '';

                    this.updateBonusActionsList(container);
                    new Notice(`Бонусное действие "${newBonusAction.name}" добавлено`);
                }));
    }

    private renderBonusActionsList(container: HTMLElement) {
        const bonusActionsListContainer = container.createDiv({ cls: 'actions-list-container' });
        bonusActionsListContainer.createEl('div', { 
            text: 'Добавленные бонусные действия:',
            cls: 'actions-list-title'
        });
        
        const bonusActionsListEl = bonusActionsListContainer.createDiv({ 
            cls: 'actions-list',
            attr: { id: 'bonus-actions-list' }
        });
        
        this.updateBonusActionsList(container);
    }

    private updateBonusActionsList(container: HTMLElement) {
        const bonusActionsListEl = container.querySelector('#bonus-actions-list');
        if (!bonusActionsListEl) return;
        
        bonusActionsListEl.empty();
        
        if (this.bonus_actions.length === 0) {
            bonusActionsListEl.createEl('div', { 
                text: 'Бонусные действия не добавлены',
                cls: 'actions-empty'
            });
            return;
        }
        
        this.bonus_actions.forEach((bonusAction, index) => {
            const bonusActionItem = bonusActionsListEl.createDiv({ cls: 'action-item' });
            
            const bonusActionHeader = bonusActionItem.createDiv({ cls: 'action-header' });
            bonusActionHeader.createEl('strong', { text: bonusAction.name });
            
            const bonusActionDesc = bonusActionItem.createDiv({ cls: 'action-desc' });
            bonusActionDesc.setText(bonusAction.desc);
            
            const removeBtn = bonusActionItem.createEl('button', {
                text: 'Удалить',
                cls: 'action-remove mod-warning'
            });
            
            removeBtn.addEventListener('click', () => {
                this.bonus_actions.splice(index, 1);
                this.updateBonusActionsList(container);
                new Notice(`Бонусное действие "${bonusAction.name}" удалено`);
            });
        });
    }

    // Геттеры
    getBonusActions(): CreatureAction[] { return this.bonus_actions; }
}