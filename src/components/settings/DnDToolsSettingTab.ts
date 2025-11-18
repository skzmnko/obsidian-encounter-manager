import { App, PluginSettingTab, Setting } from 'obsidian';
import { i18n } from 'src/services/LocalizationService';
import { BestiaryPanel, BESTIARY_VIEW_TYPE } from 'src/components/panels/BestiaryPanel';

export class DnDToolsSettingTab extends PluginSettingTab {
    plugin: any;

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'D&D Tools Settings' });

        new Setting(containerEl)
            .setName('Language')
            .setDesc('Interface language')
            .addDropdown(dropdown => dropdown
                .addOption('en', 'English')
                .addOption('ru', 'Русский')
                .setValue(this.plugin.settings.language)
                .onChange(async (value: 'en' | 'ru') => {
                    this.plugin.settings.language = value;
                    await this.plugin.saveSettings();
                    i18n.setLocale(value);

                    this.refreshAllBestiaryViews();
                }));
    }

    private refreshAllBestiaryViews() {
        this.app.workspace.getLeavesOfType(BESTIARY_VIEW_TYPE).forEach(leaf => {
            const view = leaf.view as BestiaryPanel;
            if (view && typeof (view as any).refreshLocalization === 'function') {
                (view as any).refreshLocalization();
            }
        });
    }
}