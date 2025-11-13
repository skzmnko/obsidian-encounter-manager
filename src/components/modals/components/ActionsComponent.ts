import { Setting, Notice } from 'obsidian';
import { CreatureAction } from 'src/models/Bestiary';

export class ActionsComponent {
    private actions: CreatureAction[] = [];
    private newActionName: string = '';
    private newActionDesc: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Действия' });

        this.renderAddActionForm(section);
        this.renderActionsList(section);
    }

    private renderAddActionForm(container: HTMLElement) {
        const addActionContainer = container.createDiv({ cls: 'add-action-container' });
        
        new Setting(addActionContainer)
            .setName('Название действия')
            .setDesc('Название боевого действия или способности')
            .addText(text => text
                .setPlaceholder('Укус')
                .onChange(value => this.newActionName = value));

        new Setting(addActionContainer)
            .setName('Описание действия')
            .setDesc('Подробное описание действия и его эффектов')
            .addTextArea(text => text
                .setPlaceholder('Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage.')
                .onChange(value => this.newActionDesc = value));

        new Setting(addActionContainer)
            .addButton(btn => btn
                .setButtonText('Добавить действие')
                .setCta()
                .onClick(() => {
                    if (!this.newActionName.trim()) {
                        new Notice('Пожалуйста, введите название действия');
                        return;
                    }

                    if (this.actions.length >= 10) {
                        new Notice('Достигнуто максимальное количество действий (10)');
                        return;
                    }

                    const newAction: CreatureAction = {
                        name: this.newActionName,
                        desc: this.newActionDesc
                    };

                    this.actions.push(newAction);
                    
                    this.newActionName = '';
                    this.newActionDesc = '';
                    
                    const nameInput = addActionContainer.querySelector('input[placeholder="Укус"]') as HTMLInputElement;
                    const descInput = addActionContainer.querySelector('textarea') as HTMLTextAreaElement;
                    if (nameInput) nameInput.value = '';
                    if (descInput) descInput.value = '';

                    this.updateActionsList(container);
                    new Notice(`Действие "${newAction.name}" добавлено`);
                }));
    }

    private renderActionsList(container: HTMLElement) {
        const actionsListContainer = container.createDiv({ cls: 'actions-list-container' });
        actionsListContainer.createEl('div', { 
            text: 'Добавленные действия:',
            cls: 'actions-list-title'
        });
        
        const actionsListEl = actionsListContainer.createDiv({ 
            cls: 'actions-list',
            attr: { id: 'actions-list' }
        });
        
        this.updateActionsList(container);
    }

    private updateActionsList(container: HTMLElement) {
        const actionsListEl = container.querySelector('#actions-list');
        if (!actionsListEl) return;
        
        actionsListEl.empty();
        
        if (this.actions.length === 0) {
            actionsListEl.createEl('div', { 
                text: 'Действия не добавлены',
                cls: 'actions-empty'
            });
            return;
        }
        
        this.actions.forEach((action, index) => {
            const actionItem = actionsListEl.createDiv({ cls: 'action-item' });
            
            const actionHeader = actionItem.createDiv({ cls: 'action-header' });
            actionHeader.createEl('strong', { text: action.name });
            
            const actionDesc = actionItem.createDiv({ cls: 'action-desc' });
            actionDesc.setText(action.desc);
            
            const removeBtn = actionItem.createEl('button', {
                text: 'Удалить',
                cls: 'action-remove mod-warning'
            });
            
            removeBtn.addEventListener('click', () => {
                this.actions.splice(index, 1);
                this.updateActionsList(container);
                new Notice(`Действие "${action.name}" удалено`);
            });
        });
    }

    // Геттеры
    getActions(): CreatureAction[] { return this.actions; }
}