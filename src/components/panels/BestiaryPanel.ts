import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { CreatureCreationModal } from 'src/components/modals/CreatureCreationModal';

export const BESTIARY_VIEW_TYPE = 'bestiary-view';

export class BestiaryPanel extends ItemView {
    bestiaryService: any;
    creatures: Creature[] = [];

    constructor(leaf: WorkspaceLeaf, bestiaryService: any) {
        super(leaf);
        this.bestiaryService = bestiaryService;
    }

    getViewType(): string {
        return BESTIARY_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Бестиарий';
    }

    getIcon(): string {
        return 'dragon';
    }

    async onOpen() {
        await this.loadCreatures();
        this.render();
    }

    async onClose() {
        // Cleanup
    }

    async loadCreatures() {
        this.creatures = this.bestiaryService.getAllCreatures();
    }

    render() {
        const container = this.containerEl.children[1];
        container.empty();

        // Заголовок
        const header = container.createDiv({ cls: 'bestiary-header' });
        header.createEl('h2', { text: 'Бестиарий' });

        // Кнопка добавления
        const addButton = header.createEl('button', { 
            text: 'Добавить существо',
            cls: 'mod-cta'
        });
        addButton.addEventListener('click', () => {
            this.openCreatureCreationModal();
        });

        // Список существ
        const creaturesList = container.createDiv({ cls: 'bestiary-list' });

        if (this.creatures.length === 0) {
            creaturesList.createEl('p', { 
                text: 'Существа еще не добавлены. Нажмите "Добавить существо" чтобы создать первое.',
                cls: 'bestiary-empty'
            });
            return;
        }

        this.creatures.forEach(creature => {
            this.renderCreatureItem(creaturesList, creature);
        });
    }

    renderCreatureItem(container: HTMLElement, creature: Creature) {
        const creatureEl = container.createDiv({ cls: 'creature-item' });
        
        const header = creatureEl.createDiv({ cls: 'creature-header' });
        header.createEl('h3', { text: creature.name });
        
        const meta = creatureEl.createDiv({ cls: 'creature-meta' });
        meta.createEl('span', { text: `${creature.type}, ${creature.size}` });
        meta.createEl('span', { text: `Обитает: ${creature.habitat}` });
        
        const stats = creatureEl.createDiv({ cls: 'creature-stats' });
        stats.createEl('span', { text: `AC: ${creature.ac}` });
        stats.createEl('span', { text: `HP: ${creature.hp}` });
        
        // Кнопки действий (для будущего использования)
        const actions = creatureEl.createDiv({ cls: 'creature-actions' });
        const editBtn = actions.createEl('button', { 
            text: 'Редактировать',
            cls: 'mod-secondary'
        });
        editBtn.addEventListener('click', () => {
            // TODO: Реализовать редактирование
            new Notice('Редактирование в разработке');
        });

        const deleteBtn = actions.createEl('button', { 
            text: 'Удалить',
            cls: 'mod-warning'
        });
        deleteBtn.addEventListener('click', async () => {
            // TODO: Реализовать удаление с подтверждением
            const success = await this.bestiaryService.deleteCreature(creature.id);
            if (success) {
                new Notice(`Существо "${creature.name}" удалено`);
                await this.loadCreatures();
                this.render();
            }
        });
    }

    openCreatureCreationModal() {
        const onSave = async (creature: Creature) => {
            await this.loadCreatures();
            this.render();
        };

        new CreatureCreationModal(this.app, this.bestiaryService, onSave).open();
    }
}