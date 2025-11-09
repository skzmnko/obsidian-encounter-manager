import { App, Modal } from 'obsidian';
import { EncounterCreationModal } from 'src/components/modals/EncounterCreationModal';

export class EncounterTypeModal extends Modal {
    plugin: any;

    constructor(app: App, plugin: any) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Создание энкаунтера' });
        contentEl.createEl('p', { text: 'Выберите тип энкаунтера:' });

        const types = [
            { id: 'combat', label: '⚔️ Сражение', description: 'Боевое столкновение с противниками' },
            { id: 'hazard', label: '⚠️ Опасная область', description: 'Ловушки, опасная местность' },
            { id: 'chase', label: '🏃 Погоня', description: 'Динамическое преследование' },
            { id: 'random', label: '🎲 Случайные события', description: 'Непредвиденные встречи' }
        ];

        types.forEach(type => {
            const typeButton = contentEl.createEl('button', {
                text: type.label,
                cls: 'encounter-type-button'
            });

            typeButton.addEventListener('click', () => {
                this.close();
                new EncounterCreationModal(this.app, this.plugin, type.id as any).open();
            });

            const desc = contentEl.createEl('p', {
                text: type.description,
                cls: 'encounter-type-description'
            });
        });
    }
}