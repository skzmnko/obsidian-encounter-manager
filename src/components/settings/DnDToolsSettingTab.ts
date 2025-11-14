import { App, PluginSettingTab, Setting } from 'obsidian';

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
            .setName('Default HP')
            .setDesc('Default hit points for new creatures')
            .addText(text => text
                .setPlaceholder('100')
                .setValue(this.plugin.settings.defaultHP.toString())
                .onChange(async (value) => {
                    const numValue = Number(value);
                    if (!isNaN(numValue)) {
                        this.plugin.settings.defaultHP = numValue;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName('Auto-save encounters')
            .setDesc('Automatically save encounter state')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoSave)
                .onChange(async (value) => {
                    this.plugin.settings.autoSave = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Encounters folder')
            .setDesc('Folder where encounter files will be created')
            .addText(text => text
                .setPlaceholder('Encounters')
                .setValue(this.plugin.settings.encountersFolder)
                .onChange(async (value) => {
                    this.plugin.settings.encountersFolder = value;
                    await this.plugin.saveSettings();
                }));
    }
}