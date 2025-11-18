import { Plugin } from 'obsidian';
import { EncounterManagerSettings, DEFAULT_SETTINGS } from 'src/models/Settings';
import { BestiaryService } from 'src/services/BestiaryService';
import { BestiaryPanel, BESTIARY_VIEW_TYPE } from 'src/components/panels/BestiaryPanel';
import { SpellsPanel, SPELLS_VIEW_TYPE } from 'src/components/panels/SpellsPanel';
import { SpellService } from 'src/services/SpellService';
import { DnDToolsSettingTab } from 'src/components/settings/DnDToolsSettingTab';
import { i18n } from 'src/services/LocalizationService';

export default class DnDToolsPlugin extends Plugin {
    settings!: EncounterManagerSettings;
    bestiaryService!: BestiaryService;
    spellService!: SpellService;

    async onload() {
        console.log('Loading D&D Tools plugin...');
        await this.loadSettings();
        this.setupLocalization();
        
        try {
            this.bestiaryService = new BestiaryService(this);
            this.spellService = new SpellService(this);
            
            await this.bestiaryService.initialize();
            await this.spellService.initialize();

            console.log('All services initialized successfully');

            this.addCommand({
                id: 'open-bestiary',
                name: this.getLocalizedCommandName('Open Bestiary', 'Открыть Бестиарий'),
                callback: () => {
                    this.activateBestiaryView();
                }
            });

            this.addCommand({
                id: 'open-spells',
                name: this.getLocalizedCommandName('Open Spells', 'Открыть Заклинания'),
                callback: () => {
                    this.activateSpellsView();
                }
            });

            this.addRibbonIcon('feather', this.getLocalizedCommandName('Open Bestiary', 'Открыть Бестиарий'), () => {
                this.activateBestiaryView();
            });

            this.addRibbonIcon('sparkles', this.getLocalizedCommandName('Open Spells', 'Открыть Заклинания'), () => {
                this.activateSpellsView();
            });

            this.addSettingTab(new DnDToolsSettingTab(this.app, this));
            
            this.registerView(
                BESTIARY_VIEW_TYPE,
                (leaf) => new BestiaryPanel(leaf, this.bestiaryService)
            );

            this.registerView(
                SPELLS_VIEW_TYPE,
                (leaf) => new SpellsPanel(leaf, this.spellService)
            );

            console.log('D&D Tools plugin loaded successfully');
        } catch (error) {
            console.error('Failed to load D&D Tools plugin:', error);
        }
    }

    private setupLocalization() {
        i18n.setLocale(this.settings.language);

        i18n.onLocaleChange((locale: 'en' | 'ru') => {
            this.refreshAllBestiaryViews();
            this.refreshAllSpellsViews();
        });
    }

    private refreshAllBestiaryViews() {
        this.app.workspace.getLeavesOfType(BESTIARY_VIEW_TYPE).forEach(leaf => {
            const view = leaf.view as BestiaryPanel;
            if (view && typeof view.refreshLocalization === 'function') {
                view.refreshLocalization();
            }
        });
    }

    private refreshAllSpellsViews() {
        this.app.workspace.getLeavesOfType(SPELLS_VIEW_TYPE).forEach(leaf => {
            const view = leaf.view as SpellsPanel;
            if (view && typeof view.refreshLocalization === 'function') {
                view.refreshLocalization();
            }
        });
    }

    private getLocalizedCommandName(enName: string, ruName: string): string {
        return this.settings.language === 'ru' ? ruName : enName;
    }

    async activateBestiaryView() {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(BESTIARY_VIEW_TYPE)[0];

        if (!leaf) {
            const rightLeaf = workspace.getRightLeaf(false);
            if (rightLeaf) {
                leaf = rightLeaf;
                await leaf.setViewState({
                    type: BESTIARY_VIEW_TYPE,
                    active: true,
                });
            } else {
                leaf = workspace.getLeaf('tab');
                await leaf.setViewState({
                    type: BESTIARY_VIEW_TYPE,
                    active: true,
                });
            }
        }

        workspace.revealLeaf(leaf);
        
        const view = leaf.view as BestiaryPanel;
        if (view && typeof view.onOpen === 'function') {
            await view.onOpen();
        }
    }

    async activateSpellsView() {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(SPELLS_VIEW_TYPE)[0];

        if (!leaf) {
            const rightLeaf = workspace.getRightLeaf(false);
            if (rightLeaf) {
                leaf = rightLeaf;
                await leaf.setViewState({
                    type: SPELLS_VIEW_TYPE,
                    active: true,
                });
            } else {
                leaf = workspace.getLeaf('tab');
                await leaf.setViewState({
                    type: SPELLS_VIEW_TYPE,
                    active: true,
                });
            }
        }

        workspace.revealLeaf(leaf);
        
        const view = leaf.view as SpellsPanel;
        if (view && typeof view.onOpen === 'function') {
            await view.onOpen();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {
        console.log('Unloading D&D Tools plugin...');
    }
}