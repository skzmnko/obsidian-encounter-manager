import { Setting, Notice } from 'obsidian';
import { CreatureAction } from 'src/models/Bestiary';

export class ReactionsComponent {
    private reactions: CreatureAction[] = [];
    private newReactionName: string = '';
    private newReactionDesc: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Реакции' });

        this.renderAddReactionForm(section);
        this.renderReactionsList(section);
    }

    private renderAddReactionForm(container: HTMLElement) {
        const addReactionContainer = container.createDiv({ cls: 'add-action-container' });
        
        new Setting(addReactionContainer)
            .setName('Название реакции')
            .setDesc('Название реакции')
            .addText(text => text
                .setPlaceholder('Ответный удар')
                .onChange(value => this.newReactionName = value));

        new Setting(addReactionContainer)
            .setName('Описание реакции')
            .setDesc('Подробное описание реакции и её условий срабатывания')
            .addTextArea(text => text
                .setPlaceholder('Когда существо получает удар в ближнем бою...')
                .onChange(value => this.newReactionDesc = value));

        new Setting(addReactionContainer)
            .addButton(btn => btn
                .setButtonText('Добавить реакцию')
                .setCta()
                .onClick(() => {
                    if (!this.newReactionName.trim()) {
                        new Notice('Пожалуйста, введите название реакции');
                        return;
                    }

                    if (this.reactions.length >= 10) {
                        new Notice('Достигнуто максимальное количество реакций (10)');
                        return;
                    }

                    const newReaction: CreatureAction = {
                        name: this.newReactionName,
                        desc: this.newReactionDesc
                    };

                    this.reactions.push(newReaction);
                    
                    this.newReactionName = '';
                    this.newReactionDesc = '';
                    
                    const nameInput = addReactionContainer.querySelector('input[placeholder="Ответный удар"]') as HTMLInputElement;
                    const descInput = addReactionContainer.querySelector('textarea') as HTMLTextAreaElement;
                    if (nameInput) nameInput.value = '';
                    if (descInput) descInput.value = '';

                    this.updateReactionsList(container);
                    new Notice(`Реакция "${newReaction.name}" добавлена`);
                }));
    }

    private renderReactionsList(container: HTMLElement) {
        const reactionsListContainer = container.createDiv({ cls: 'actions-list-container' });
        reactionsListContainer.createEl('div', { 
            text: 'Добавленные реакции:',
            cls: 'actions-list-title'
        });
        
        const reactionsListEl = reactionsListContainer.createDiv({ 
            cls: 'actions-list',
            attr: { id: 'reactions-list' }
        });
        
        this.updateReactionsList(container);
    }

    private updateReactionsList(container: HTMLElement) {
        const reactionsListEl = container.querySelector('#reactions-list');
        if (!reactionsListEl) return;
        
        reactionsListEl.empty();
        
        if (this.reactions.length === 0) {
            reactionsListEl.createEl('div', { 
                text: 'Реакции не добавлены',
                cls: 'actions-empty'
            });
            return;
        }
        
        this.reactions.forEach((reaction, index) => {
            const reactionItem = reactionsListEl.createDiv({ cls: 'action-item' });
            
            const reactionHeader = reactionItem.createDiv({ cls: 'action-header' });
            reactionHeader.createEl('strong', { text: reaction.name });
            
            const reactionDesc = reactionItem.createDiv({ cls: 'action-desc' });
            reactionDesc.setText(reaction.desc);
            
            const removeBtn = reactionItem.createEl('button', {
                text: 'Удалить',
                cls: 'action-remove mod-warning'
            });
            
            removeBtn.addEventListener('click', () => {
                this.reactions.splice(index, 1);
                this.updateReactionsList(container);
                new Notice(`Реакция "${reaction.name}" удалена`);
            });
        });
    }

    // Геттеры
    getReactions(): CreatureAction[] { return this.reactions; }
}