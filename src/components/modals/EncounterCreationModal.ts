import { App, Modal, Setting, Notice } from 'obsidian';
import { Participant } from 'src/models/Encounter';
import { CombatParticipantModal } from 'src/components/modals/CombatParticipantModal';

export class EncounterCreationModal extends Modal {
    plugin: any;
    type: 'combat' | 'hazard' | 'chase' | 'random';
    name: string = '';
    description: string = '';
    
    // Поля для сражения
    difficulty: string = 'medium';
    environment: string = '';
    participants: Participant[] = [];

    constructor(app: App, plugin: any, type: 'combat' | 'hazard' | 'chase' | 'random') {
        super(app);
        this.plugin = plugin;
        this.type = type;
    }

    onOpen() {
        const { contentEl } = this;
        const typeLabel = this.plugin.encounterService.getEncounterTypeLabel(this.type);
        contentEl.createEl('h2', { text: `Создание энкаунтера: ${typeLabel}` });

        // Общие поля для всех типов
        new Setting(contentEl)
            .setName('Название')
            .setDesc('Название энкаунтера')
            .addText(text => text
                .setPlaceholder('Введите название...')
                .onChange(value => {
                    this.name = value;
                }));

        new Setting(contentEl)
            .setName('Описание')
            .setDesc('Описание энкаунтера')
            .addTextArea(text => text
                .setPlaceholder('Опишите энкаунтер...')
                .onChange(value => {
                    this.description = value;
                }));

        // Специфичные поля в зависимости от типа
        this.renderTypeSpecificFields(contentEl);

        // Кнопка создания
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Создать энкаунтер')
                .setCta()
                .onClick(async () => {
                    if (!this.name.trim()) {
                        new Notice('Пожалуйста, введите название энкаунтера');
                        return;
                    }

                    const encounterData: any = {
                        name: this.name,
                        description: this.description,
                        type: this.type,
                        participants: this.participants
                    };

                    // Добавляем специфичные поля
                    if (this.type === 'combat') {
                        encounterData.difficulty = this.difficulty;
                        encounterData.environment = this.environment;
                    }

                    const encounter = await this.plugin.encounterService.createEncounter(encounterData);
                    
                    // Вставляем энкаунтер в текущую заметку
                    this.plugin.uiService.insertEncounterToCurrentNote(encounter);
                    
                    this.close();
                    new Notice(`Энкаунтер "${encounter.name}" создан!`);
                }));
    }

    renderTypeSpecificFields(contentEl: HTMLElement) {
        switch (this.type) {
            case 'combat':
                this.renderCombatFields(contentEl);
                break;
            case 'hazard':
                this.renderHazardFields(contentEl);
                break;
            case 'chase':
                this.renderChaseFields(contentEl);
                break;
            case 'random':
                this.renderRandomFields(contentEl);
                break;
        }
    }

    renderCombatFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Параметры сражения' });

        // Сложность
        new Setting(contentEl)
            .setName('Сложность')
            .setDesc('Уровень сложности сражения')
            .addDropdown(dropdown => dropdown
                .addOption('easy', 'Легкая')
                .addOption('medium', 'Средняя')
                .addOption('hard', 'Сложная')
                .addOption('deadly', 'Смертельная')
                .setValue(this.difficulty)
                .onChange(value => {
                    this.difficulty = value;
                }));

        // Локация
        new Setting(contentEl)
            .setName('Локация')
            .setDesc('Место проведения сражения')
            .addText(text => text
                .setPlaceholder('Лес, подземелье, город...')
                .onChange(value => {
                    this.environment = value;
                }));

        // Участники
        contentEl.createEl('h3', { text: 'Участники сражения' });
        
        const addParticipantBtn = contentEl.createEl('button', { 
            text: 'Добавить участника',
            cls: 'mod-cta'
        });
        
        addParticipantBtn.addEventListener('click', () => {
            new CombatParticipantModal(this.app, this).open();
        });

        // Список добавленных участников
        this.participantsContainer = contentEl.createDiv({ cls: 'participants-list' });
        this.updateParticipantsList();
    }

    renderHazardFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Параметры опасной области' });
        // Добавьте поля для опасных областей
    }

    renderChaseFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Параметры погони' });
        // Добавьте поля для погони
    }

    renderRandomFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { text: 'Параметры случайного события' });
        // Добавьте поля для случайных событий
    }

    participantsContainer: HTMLElement;

    updateParticipantsList() {
        if (!this.participantsContainer) return;
        
        this.participantsContainer.empty();
        
        if (this.participants.length === 0) {
            this.participantsContainer.setText('Участники не добавлены');
            return;
        }

        this.participants.forEach((participant, index) => {
            const participantEl = this.participantsContainer.createDiv({ 
                cls: 'participant-item' 
            });
            
            participantEl.setText(
                `${participant.name} (${participant.type}) - HP: ${participant.hp}/${participant.maxHp}, AC: ${participant.ac}`
            );

            const removeBtn = participantEl.createEl('button', {
                text: 'Удалить',
                cls: 'mod-warning'
            });
            
            removeBtn.style.marginLeft = '10px';
            removeBtn.addEventListener('click', () => {
                this.participants.splice(index, 1);
                this.updateParticipantsList();
            });
        });
    }

    addParticipant(participant: Omit<Participant, 'id'>) {
        const newParticipant: Participant = {
            ...participant,
            id: this.plugin.encounterService.generateParticipantId()
        };
        
        this.participants.push(newParticipant);
        this.updateParticipantsList();
    }
}