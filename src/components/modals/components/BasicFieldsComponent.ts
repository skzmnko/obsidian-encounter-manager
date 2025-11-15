import { Setting } from 'obsidian';
import { CREATURE_TYPES, CREATURE_SIZES, ALIGNMENTS, CreatureTypeKey, SizeKey, AlignmentKey } from 'src/constants/Constants';
import { i18n } from 'src/services/LocalizationService';

export class BasicFieldsComponent {
    private name: string = '';
    private type: CreatureTypeKey = 'HUMANOID';
    private size: SizeKey = 'MEDIUM';
    private alignment: AlignmentKey = 'NO_ALIGNMENT';
    private habitat: string = '';
    private languages: string = '';

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { 
            text: i18n.t('BASIC_FIELDS.TITLE'),
            cls: 'section-title'
        });

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.NAME'))
            .setDesc(i18n.t('BASIC_FIELDS.NAME_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('BASIC_FIELDS.NAME_PLACEHOLDER'))
                .onChange(value => this.name = value));

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.TYPE'))
            .setDesc(i18n.t('BASIC_FIELDS.TYPE_DESC'))
            .addDropdown(dropdown => {
                const creatureTypes = i18n.getGameDataCategory('CREATURE_TYPES');
                CREATURE_TYPES.forEach(typeKey => {
                    dropdown.addOption(typeKey, creatureTypes[typeKey] || typeKey);
                });
                dropdown.setValue(this.type)
                    .onChange(value => this.type = value as CreatureTypeKey);
            });

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.SIZE'))
            .setDesc(i18n.t('BASIC_FIELDS.SIZE_DESC'))
            .addDropdown(dropdown => {
                const sizes = i18n.getGameDataCategory('SIZES');
                CREATURE_SIZES.forEach(sizeKey => {
                    dropdown.addOption(sizeKey, sizes[sizeKey] || sizeKey);
                });
                dropdown.setValue(this.size)
                    .onChange(value => this.size = value as SizeKey);
            });

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.ALIGNMENT'))
            .setDesc(i18n.t('BASIC_FIELDS.ALIGNMENT_DESC'))
            .addDropdown(dropdown => {
                const alignments = i18n.getGameDataCategory('ALIGNMENTS');
                ALIGNMENTS.forEach(alignmentKey => {
                    dropdown.addOption(alignmentKey, alignments[alignmentKey] || alignmentKey);
                });
                dropdown.setValue(this.alignment)
                    .onChange(value => this.alignment = value as AlignmentKey);
            });

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.HABITAT'))
            .setDesc(i18n.t('BASIC_FIELDS.HABITAT_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('BASIC_FIELDS.HABITAT_PLACEHOLDER'))
                .setValue(this.habitat)
                .onChange(value => this.habitat = value));

        new Setting(section)
            .setName(i18n.t('BASIC_FIELDS.LANGUAGES'))
            .setDesc(i18n.t('BASIC_FIELDS.LANGUAGES_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('BASIC_FIELDS.LANGUAGES_PLACEHOLDER'))
                .setValue(this.languages)
                .onChange(value => this.languages = value);
                text.inputEl.addClass('languages-textarea');
                text.inputEl.addClass('fixed-textarea');
            });
        }

    getName(): string { return this.name; }
    getType(): string { return this.type; }
    getSize(): SizeKey { return this.size; }
    getAlignment(): AlignmentKey { return this.alignment; }
    getHabitat(): string { return this.habitat; }
    getLanguages(): string { return this.languages; }
}