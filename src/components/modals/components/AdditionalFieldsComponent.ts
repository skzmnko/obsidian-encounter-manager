import { Setting } from 'obsidian';

export class AdditionalFieldsComponent {
    private skills: string = '';
    private senses: string = '';
    private notes: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { text: 'Дополнительные характеристики' });

        new Setting(section)
            .setName('Навыки')
            .setDesc('Навыки существа')
            .addTextArea(text => {
                text.setPlaceholder('Восприятие +2, Скрытность +4')
                .setValue(this.skills)
                .onChange(value => this.skills = value);
                text.inputEl.addClass('skills-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        new Setting(section)
            .setName('Чувства')
            .setDesc('Особые чувства')
            .addTextArea(text => {
                text.setPlaceholder('Тёмное зрение 60 ft., пассивное Восприятие 12')
                .setValue(this.senses)
                .onChange(value => this.senses = value);
            text.inputEl.addClass('senses-textarea');
            text.inputEl.addClass('fixed-textarea');
            });

        new Setting(section)
            .setName('Заметки')
            .setDesc('Дополнительные заметки')
            .addTextArea(text => {
                text.setPlaceholder('Особое поведение, тактика боя и т.д.')
                .setValue(this.notes)
                .onChange(value => this.notes = value);
                text.inputEl.addClass('notes-textarea');
                text.inputEl.addClass('fixed-textarea');
            });
    }

    // Геттеры
    getSkills(): string { return this.skills; }
    getSenses(): string { return this.senses; }
    getNotes(): string { return this.notes; }
}