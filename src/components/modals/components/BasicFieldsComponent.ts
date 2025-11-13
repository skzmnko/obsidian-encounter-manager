import { Setting } from 'obsidian';
import { CREATURE_SIZES, ALIGNMENTS } from 'src/constants/Constants';

export class BasicFieldsComponent {
    private name: string = '';
    private type: string = '';
    private size: string = 'Medium';
    private alignment: string = 'Без мировоззрения';
    private habitat: string = '';
    private languages: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Общая информация' });

        new Setting(section)
            .setName('Имя')
            .setDesc('Название существа')
            .addText(text => text
                .setPlaceholder('Древний красный дракон')
                .onChange(value => this.name = value));

        new Setting(section)
            .setName('Тип')
            .setDesc('Тип существа (дракон, гуманоид, зверь и т.д.)')
            .addText(text => text
                .setPlaceholder('Дракон')
                .onChange(value => this.type = value));

        new Setting(section)
            .setName('Размер')
            .setDesc('Размер существа')
            .addDropdown(dropdown => {
                CREATURE_SIZES.forEach(size => {
                    dropdown.addOption(size.value, size.label);
                });
                dropdown.setValue(this.size)
                    .onChange(value => this.size = value);
            });

        new Setting(section)
            .setName('Мировоззрение')
            .setDesc('Мировоззрение существа')
            .addDropdown(dropdown => {
                ALIGNMENTS.forEach(alignment => {
                    dropdown.addOption(alignment.value, alignment.label);
                });
                dropdown.setValue(this.alignment)
                    .onChange(value => this.alignment = value);
            });

        new Setting(section)
            .setName('Место обитания')
            .setDesc('Типичная среда обитания существа')
            .addText(text => text
                .setPlaceholder('Горы, леса, подземелья...')
                .setValue(this.habitat)
                .onChange(value => this.habitat = value));

        new Setting(section)
            .setName('Языки')
            .setDesc('Известные языки')
            .addTextArea(text => {
                text.setPlaceholder('Общий, Драконий')
                .setValue(this.languages)
                .onChange(value => this.languages = value);
                text.inputEl.addClass('languages-textarea');
                text.inputEl.addClass('fixed-textarea');
            });
        }

    // Геттеры
    getName(): string { return this.name; }
    getType(): string { return this.type; }
    getSize(): string { return this.size; }
    getAlignment(): string { return this.alignment; }
    getHabitat(): string { return this.habitat; }
    getLanguages(): string { return this.languages; }
}