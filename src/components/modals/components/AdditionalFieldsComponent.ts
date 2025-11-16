import { Setting } from 'obsidian';
import { i18n } from 'src/services/LocalizationService';

export class AdditionalFieldsComponent {
    private skills: string = '';
    private senses: string = '';
    private alchemy_ingredients: string = '';
    private craft_ingredients: string = '';
    private statements: string = '';
    private tactics: string = '';
    private alchemySetting: Setting | null = null;
    private craftSetting: Setting | null = null;
    private statementsSetting: Setting | null = null;

    render(container: HTMLElement) {
        const section = container.createDiv({ cls: 'creature-section' });
        section.createEl('h3', { 
            text: i18n.t('ADDITIONAL_FIELDS.TITLE'),
            cls: 'section-title'
        });

        new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.SKILLS'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.SKILLS_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.SKILLS_PLACEHOLDER'))
                .setValue(this.skills)
                .onChange(value => this.skills = value);
                text.inputEl.addClass('skills-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.SENSES'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.SENSES_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.SENSES_PLACEHOLDER'))
                .setValue(this.senses)
                .onChange(value => this.senses = value);
                text.inputEl.addClass('senses-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        this.alchemySetting = new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.ALCHEMY_INGREDIENTS'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.ALCHEMY_INGREDIENTS_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.ALCHEMY_INGREDIENTS_PLACEHOLDER'))
                .setValue(this.alchemy_ingredients)
                .onChange(value => this.alchemy_ingredients = value);
                text.inputEl.addClass('alchemy-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        this.craftSetting = new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.CRAFT_INGREDIENTS'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.CRAFT_INGREDIENTS_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.CRAFT_INGREDIENTS_PLACEHOLDER'))
                .setValue(this.craft_ingredients)
                .onChange(value => this.craft_ingredients = value);
                text.inputEl.addClass('craft-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        this.statementsSetting = new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.STATEMENTS'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.STATEMENTS_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.STATEMENTS_PLACEHOLDER'))
                .setValue(this.statements)
                .onChange(value => this.statements = value);
                text.inputEl.addClass('statements-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        new Setting(section)
            .setName(i18n.t('ADDITIONAL_FIELDS.TACTICS'))
            .setDesc(i18n.t('ADDITIONAL_FIELDS.TACTICS_DESC'))
            .addTextArea(text => {
                text.setPlaceholder(i18n.t('ADDITIONAL_FIELDS.TACTICS_PLACEHOLDER'))
                .setValue(this.tactics)
                .onChange(value => this.tactics = value);
                text.inputEl.addClass('tactics-textarea');
                text.inputEl.addClass('fixed-textarea');
            });

        this.toggleIngredientsVisibility(true);
    }

    toggleIngredientsVisibility(isHumanoid: boolean): void {
        if (!this.alchemySetting || !this.craftSetting || !this.statementsSetting) return;
        
        if (isHumanoid) {
            this.alchemySetting.settingEl.hide();
            this.craftSetting.settingEl.hide();
            this.statementsSetting.settingEl.show();
        } else {
            this.alchemySetting.settingEl.show();
            this.craftSetting.settingEl.show();
            this.statementsSetting.settingEl.hide();
        }
    }

    getSkills(): string { return this.skills; }
    getSenses(): string { return this.senses; }
    getAlchemyIngredients(): string { return this.alchemy_ingredients; }
    getCraftIngredients(): string { return this.craft_ingredients; }
    getStatements(): string { return this.statements; }
    getTactics(): string { return this.tactics; }
}