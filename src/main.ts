import { Plugin } from 'obsidian';
import { EncounterManagerSettings, DEFAULT_SETTINGS } from 'src/models/Settings';
import { BestiaryService } from 'src/services/BestiaryService';
import { BestiaryPanel, BESTIARY_VIEW_TYPE } from 'src/components/panels/BestiaryPanel';
import { EncounterService } from 'src/services/EncounterService';
import { UIService } from 'src/services/UIService';
import { EncounterTypeModal } from 'src/components/modals/EncounterTypeModal';
import { DnDToolsSettingTab } from 'src/components/settings/DnDToolsSettingTab';

export default class DnDToolsPlugin extends Plugin {
    settings!: EncounterManagerSettings;
    encounterService!: EncounterService;
    uiService!: UIService;
    bestiaryService!: BestiaryService;

    async onload() {
        console.log('Loading D&D Tools plugin...');
        
        await this.loadSettings();
        
        try {
            // Инициализация сервисов
            this.encounterService = new EncounterService(this);
            this.uiService = new UIService(this.app);
            this.bestiaryService = new BestiaryService(this);
            
            await this.encounterService.initialize();
            await this.bestiaryService.initialize();

            // Команды и UI
            this.addCommand({
                id: 'create-encounter',
                name: 'Create new encounter',
                callback: () => {
                    new EncounterTypeModal(this.app, this).open();
                }
            });

            // Команда для открытия бестиария
            this.addCommand({
                id: 'open-bestiary',
                name: 'Open Bestiary',
                callback: () => {
                    this.activateBestiaryView();
                }
            });

            this.addRibbonIcon('swords', 'Encounter Manager', () => {
                new EncounterTypeModal(this.app, this).open();
            });

            // Добавляем иконку для бестиария
            this.addRibbonIcon('feather', 'Open Bestiary', () => {
                this.activateBestiaryView();
            });

            this.addSettingTab(new DnDToolsSettingTab(this.app, this));

            // Регистрируем панель бестиария
            this.registerView(
                BESTIARY_VIEW_TYPE,
                (leaf) => new BestiaryPanel(leaf, this.bestiaryService)
            );

            this.registerMarkdownCodeBlockProcessor('encounter', (source, el, ctx) => {
                this.uiService.renderEncounterBlock(source, el, (type: string) => 
                    this.encounterService.getEncounterTypeLabel(type)
                );
            });

            console.log('D&D Tools plugin loaded successfully');
        } catch (error) {
            console.error('Failed to load D&D Tools plugin:', error);
        }
    }

    // Метод для активации панели бестиария
     async activateBestiaryView() {
        const { workspace } = this.app;

        // Проверяем, не открыта ли уже панель бестиария
        let leaf = workspace.getLeavesOfType(BESTIARY_VIEW_TYPE)[0];

        if (!leaf) {
            // Создаем новую панель справа
            const rightLeaf = workspace.getRightLeaf(false);
            if (rightLeaf) {
                leaf = rightLeaf;
                await leaf.setViewState({
                    type: BESTIARY_VIEW_TYPE,
                    active: true,
                });
            } else {
                // Если правой панели нет, создаем новую
                leaf = workspace.getLeaf('tab');
                await leaf.setViewState({
                    type: BESTIARY_VIEW_TYPE,
                    active: true,
                });
            }
        }

        // Активируем панель
        workspace.revealLeaf(leaf);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // Новый метод для получения пути к папке encounters
    getEncountersFolderPath(): string {
        return `${this.manifest.dir}/encounters`;
    }
}