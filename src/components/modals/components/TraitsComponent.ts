import { Setting, Notice } from 'obsidian';
import { CreatureTrait } from 'src/models/Bestiary';

export class TraitsComponent {
    private traits: CreatureTrait[] = [];
    private newTraitName: string = '';
    private newTraitDesc: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Черты' });

        this.renderAddTraitForm(section);
        this.renderTraitsList(section);
    }

    private renderAddTraitForm(container: HTMLElement) {
        const addTraitContainer = container.createDiv({ cls: 'add-trait-container' });
        
        new Setting(addTraitContainer)
            .setName('Название черты')
            .setDesc('Название особой черты или способности')
            .addText(text => text
                .setPlaceholder('Амфибия')
                .onChange(value => this.newTraitName = value));

        new Setting(addTraitContainer)
            .setName('Описание черты')
            .setDesc('Подробное описание черты')
            .addTextArea(text => {
                text.setPlaceholder('Существо может дышать как воздухом, так и водой...')
                .onChange(value => this.newTraitDesc = value);
                text.inputEl.addClass('trait-desc-textarea');
                text.inputEl.addClass('wide-textarea');
        });

        new Setting(addTraitContainer)
            .addButton(btn => btn
                .setButtonText('Добавить черту')
                .setCta()
                .onClick(() => {
                    if (!this.newTraitName.trim()) {
                        new Notice('Пожалуйста, введите название черты');
                        return;
                    }

                    if (this.traits.length >= 10) {
                        new Notice('Достигнуто максимальное количество черт (10)');
                        return;
                    }

                    const newTrait: CreatureTrait = {
                        name: this.newTraitName,
                        desc: this.newTraitDesc
                    };

                    this.traits.push(newTrait);
                    
                    this.newTraitName = '';
                    this.newTraitDesc = '';
                    
                    const nameInput = addTraitContainer.querySelector('input[placeholder="Амфибия"]') as HTMLInputElement;
                    const descInput = addTraitContainer.querySelector('textarea') as HTMLTextAreaElement;
                    if (nameInput) nameInput.value = '';
                    if (descInput) descInput.value = '';

                    this.updateTraitsList(container);
                    new Notice(`Черта "${newTrait.name}" добавлена`);
                }));
    }

    private renderTraitsList(container: HTMLElement) {
        const traitsListContainer = container.createDiv({ cls: 'traits-list-container' });
        traitsListContainer.createEl('div', { 
            text: 'Добавленные черты:',
            cls: 'traits-list-title'
        });
        
        const traitsListEl = traitsListContainer.createDiv({ 
            cls: 'traits-list',
            attr: { id: 'traits-list' }
        });
        
        this.updateTraitsList(container);
    }

    private updateTraitsList(container: HTMLElement) {
        const traitsListEl = container.querySelector('#traits-list');
        if (!traitsListEl) return;
        
        traitsListEl.empty();
        
        if (this.traits.length === 0) {
            traitsListEl.createEl('div', { 
                text: 'Черты не добавлены',
                cls: 'traits-empty'
            });
            return;
        }
        
        this.traits.forEach((trait, index) => {
            const traitItem = traitsListEl.createDiv({ cls: 'trait-item' });
            
            const traitHeader = traitItem.createDiv({ cls: 'trait-header' });
            traitHeader.createEl('strong', { text: trait.name });
            
            const traitDesc = traitItem.createDiv({ cls: 'trait-desc' });
            traitDesc.setText(trait.desc);
            
            const removeBtn = traitItem.createEl('button', {
                text: 'Удалить',
                cls: 'trait-remove mod-warning'
            });
            
            removeBtn.addEventListener('click', () => {
                this.traits.splice(index, 1);
                this.updateTraitsList(container);
                new Notice(`Черта "${trait.name}" удалена`);
            });
        });
    }

    // Геттеры
    getTraits(): CreatureTrait[] { return this.traits; }
}