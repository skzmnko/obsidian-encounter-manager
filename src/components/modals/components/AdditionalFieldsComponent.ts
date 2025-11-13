import { Setting } from 'obsidian';

export class AdditionalFieldsComponent {
    private skills: string = '';
    private senses: string = '';
    private languages: string = '';
    private legendaryActions: string = '';
    private notes: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Дополнительные характеристики' });

        new Setting(section)
            .setName('Навыки')
            .setDesc('Навыки существа')
            .addTextArea(text => text
                .setPlaceholder('Восприятие +2, Скрытность +4')
                .setValue(this.skills)
                .onChange(value => this.skills = value));

        new Setting(section)
            .setName('Чувства')
            .setDesc('Особые чувства')
            .addTextArea(text => text
                .setPlaceholder('Тёмное зрение 60 ft., пассивное Восприятие 12')
                .setValue(this.senses)
                .onChange(value => this.senses = value));

        new Setting(section)
            .setName('Языки')
            .setDesc('Известные языки')
            .addTextArea(text => text
                .setPlaceholder('Общий, Драконий')
                .setValue(this.languages)
                .onChange(value => this.languages = value));

        new Setting(section)
            .setName('Легендарные действия')
            .setDesc('Легендарные действия')
            .addTextArea(text => text
                .setPlaceholder('Существо может совершить 3 легендарных действия...')
                .setValue(this.legendaryActions)
                .onChange(value => this.legendaryActions = value));

        new Setting(section)
            .setName('Заметки')
            .setDesc('Дополнительные заметки')
            .addTextArea(text => text
                .setPlaceholder('Особое поведение, тактика боя и т.д.')
                .setValue(this.notes)
                .onChange(value => this.notes = value));
    }

    // Геттеры
    getSkills(): string { return this.skills; }
    getSenses(): string { return this.senses; }
    getLanguages(): string { return this.languages; }
    getLegendaryActions(): string { return this.legendaryActions; }
    getNotes(): string { return this.notes; }
}