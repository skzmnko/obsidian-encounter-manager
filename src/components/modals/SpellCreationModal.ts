import { App, Modal, Setting, Notice, TextAreaComponent } from 'obsidian';
import { Spell } from 'src/models/Spells';
import { i18n } from 'src/services/LocalizationService';
import { SpellSchoolKey, SpellClassKey, ActionTypeKey } from 'src/constants/game_data_i18n';
import { SpellModalStyles } from './SpellModalStyles';

export class SpellCreationModal extends Modal {
    private spellData: Partial<Spell> = {
        name: '',
        level: 0,
        school: '',
        classes: [],
        actionType: 'ACTION',
        concentration: false,
        ritual: false,
        castingTime: '',
        range: '',
        components: {
            verbal: false,
            somatic: false,
            material: false,
            materialDescription: ''
        },
        duration: '',
        description: '',
        cantripUpgrade: '',
        manaCost: false
    };

    private selectedClassesContainer: HTMLElement | null = null;

    constructor(
        app: App, 
        private spellService: any, 
        private onSave: (spell: Spell) => void
    ) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.addClass('spell-modal-container');
        
        // Apply styles
        this.applyStyles(contentEl);
        
        contentEl.createEl('h2', { text: i18n.t('SPELL_MODAL.TITLE') });
        
        this.renderBasicFields(contentEl);
        this.renderComponentsSection(contentEl);
        this.renderDescriptionSection(contentEl);
        this.renderSaveButtons(contentEl);
    }

    private applyStyles(contentEl: HTMLElement) {
        const style = contentEl.createEl('style');
        style.textContent = SpellModalStyles;
    }

    private renderBasicFields(contentEl: HTMLElement) {
        contentEl.createEl('h3', { 
            text: i18n.t('SPELL_FIELDS.TITLE'),
            cls: 'spell-section-title'
        });

        // Name
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.NAME'))
            .setDesc(i18n.t('SPELL_FIELDS.NAME_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('SPELL_FIELDS.NAME_PLACEHOLDER'))
                .setValue(this.spellData.name || '')
                .onChange(value => this.spellData.name = value));

        // Level
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.LEVEL'))
            .setDesc(i18n.t('SPELL_FIELDS.LEVEL_DESC'))
            .addDropdown(dropdown => {
                dropdown.addOption('0', '0 (Cantrip)');
                for (let i = 1; i <= 9; i++) {
                    dropdown.addOption(i.toString(), `${i} (Level ${i})`);
                }
                dropdown.setValue(this.spellData.level?.toString() || '0')
                    .onChange(value => this.spellData.level = parseInt(value));
            });

        // School
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.SCHOOL'))
            .setDesc(i18n.t('SPELL_FIELDS.SCHOOL_DESC'))
            .addDropdown(dropdown => {
                const schools = i18n.getGameDataCategory('SPELL_SCHOOLS');
                dropdown.addOption('', i18n.t('SPELL_FIELDS.SELECT_DAMAGE') || 'Select school...');
                Object.entries(schools).forEach(([key, value]) => {
                    dropdown.addOption(key, value);
                });
                dropdown.setValue(this.spellData.school || '')
                    .onChange(value => this.spellData.school = value);
            });

        // Classes (multi-select)
        const classesSetting = new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.CLASSES'))
            .setDesc(i18n.t('SPELL_FIELDS.CLASSES_DESC'))
            .addDropdown(dropdown => {
                const classes = i18n.getGameDataCategory('SPELL_CLASSES');
                dropdown.addOption('', 'Select class...');
                Object.entries(classes).forEach(([key, value]) => {
                    dropdown.addOption(key, value);
                });
                dropdown.setValue('')
                    .onChange(value => {
                        if (value && !this.spellData.classes?.includes(value)) {
                            this.spellData.classes = [...(this.spellData.classes || []), value];
                            this.updateSelectedClassesDisplay();
                        }
                        dropdown.setValue(''); // Reset dropdown after selection
                    });
            });

        // Container for selected classes
        this.selectedClassesContainer = contentEl.createDiv('selected-classes-container');
        this.updateSelectedClassesDisplay();

        // Action Type
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.ACTION_TYPE'))
            .setDesc(i18n.t('SPELL_FIELDS.ACTION_TYPE_DESC'))
            .addDropdown(dropdown => {
                const actionTypes = i18n.getGameDataCategory('ACTION_TYPES');
                Object.entries(actionTypes).forEach(([key, value]) => {
                    dropdown.addOption(key, value);
                });
                dropdown.setValue(this.spellData.actionType || 'ACTION')
                    .onChange(value => this.spellData.actionType = value as ActionTypeKey);
            });

        // Concentration and Ritual
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.CONCENTRATION'))
            .setDesc(i18n.t('SPELL_FIELDS.CONCENTRATION_DESC'))
            .addToggle(toggle => toggle
                .setValue(this.spellData.concentration || false)
                .onChange(value => this.spellData.concentration = value));

        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.RITUAL'))
            .setDesc(i18n.t('SPELL_FIELDS.RITUAL_DESC'))
            .addToggle(toggle => toggle
                .setValue(this.spellData.ritual || false)
                .onChange(value => this.spellData.ritual = value));

        // Casting Time
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.CASTING_TIME'))
            .setDesc(i18n.t('SPELL_FIELDS.CASTING_TIME_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('SPELL_FIELDS.CASTING_TIME_PLACEHOLDER'))
                .setValue(this.spellData.castingTime || '')
                .onChange(value => this.spellData.castingTime = value));

        // Range
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.RANGE'))
            .setDesc(i18n.t('SPELL_FIELDS.RANGE_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('SPELL_FIELDS.RANGE_PLACEHOLDER'))
                .setValue(this.spellData.range || '')
                .onChange(value => this.spellData.range = value));

        // Duration
        new Setting(contentEl)
            .setName(i18n.t('SPELL_FIELDS.DURATION'))
            .setDesc(i18n.t('SPELL_FIELDS.DURATION_DESC'))
            .addText(text => text
                .setPlaceholder(i18n.t('SPELL_FIELDS.DURATION_PLACEHOLDER'))
                .setValue(this.spellData.duration || '')
                .onChange(value => this.spellData.duration = value));
    }

    private updateSelectedClassesDisplay() {
        if (!this.selectedClassesContainer) return;

        this.selectedClassesContainer.empty();
        
        if (!this.spellData.classes || this.spellData.classes.length === 0) {
            const emptyText = this.selectedClassesContainer.createDiv('selected-values-empty');
            emptyText.setText(i18n.t('IMMUNITIES.NOT_SELECTED') || 'No classes selected');
            return;
        }

        this.selectedClassesContainer.createEl('div', { 
            text: i18n.t('SPELL_FIELDS.CLASSES') + ':',
            cls: 'selected-values-title'
        });
        
        const classesList = this.selectedClassesContainer.createDiv('selected-values-list');
        this.spellData.classes.forEach(className => {
            const classItem = classesList.createDiv('selected-value-item');
            classItem.setText(i18n.getGameData('SPELL_CLASSES', className as SpellClassKey));
            
            const removeBtn = classItem.createEl('button', { 
                text: '×',
                cls: 'selected-value-remove'
            });
            removeBtn.addEventListener('click', () => {
                this.spellData.classes = this.spellData.classes?.filter(c => c !== className);
                this.updateSelectedClassesDisplay();
            });
        });
    }

    private renderComponentsSection(contentEl: HTMLElement) {
        contentEl.createEl('h3', { 
            text: i18n.t('SPELL_FIELDS.COMPONENTS'),
            cls: 'spell-section-title'
        });

        const componentsContainer = contentEl.createDiv('components-section');

        // Verbal
        new Setting(componentsContainer)
            .setName(i18n.t('SPELL_FIELDS.VERBAL'))
            .setDesc(i18n.t('SPELL_FIELDS.VERBAL_DESC'))
            .addToggle(toggle => toggle
                .setValue(this.spellData.components?.verbal || false)
                .onChange(value => {
                    if (!this.spellData.components) this.spellData.components = { verbal: false, somatic: false, material: false };
                    this.spellData.components.verbal = value;
                }));

        // Somatic
        new Setting(componentsContainer)
            .setName(i18n.t('SPELL_FIELDS.SOMATIC'))
            .setDesc(i18n.t('SPELL_FIELDS.SOMATIC_DESC'))
            .addToggle(toggle => toggle
                .setValue(this.spellData.components?.somatic || false)
                .onChange(value => {
                    if (!this.spellData.components) this.spellData.components = { verbal: false, somatic: false, material: false };
                    this.spellData.components.somatic = value;
                }));

        // Material
        new Setting(componentsContainer)
            .setName(i18n.t('SPELL_FIELDS.MATERIAL'))
            .setDesc(i18n.t('SPELL_FIELDS.MATERIAL_DESC'))
            .addToggle(toggle => toggle
                .setValue(this.spellData.components?.material || false)
                .onChange(value => {
                    if (!this.spellData.components) this.spellData.components = { verbal: false, somatic: false, material: false };
                    this.spellData.components.material = value;
                    // Re-render to show/hide material description
                    this.renderMaterialDescription(componentsContainer);
                }));

        this.renderMaterialDescription(componentsContainer);
    }

    private renderMaterialDescription(container: HTMLElement) {
        // Remove existing material description if any
        const existingDesc = container.querySelector('.material-description-container');
        if (existingDesc) {
            existingDesc.remove();
        }

        // Add material description if material component is enabled
        if (this.spellData.components?.material) {
            const materialDescContainer = container.createDiv('material-description-container');
            new Setting(materialDescContainer)
                .setName(i18n.t('SPELL_FIELDS.MATERIAL_DESCRIPTION'))
                .setDesc(i18n.t('SPELL_FIELDS.MATERIAL_DESCRIPTION_DESC'))
                .addTextArea(textarea => {
                    textarea.setPlaceholder(i18n.t('SPELL_FIELDS.MATERIAL_DESCRIPTION_PLACEHOLDER'))
                        .setValue(this.spellData.components?.materialDescription || '')
                        .onChange(value => {
                            if (this.spellData.components) {
                                this.spellData.components.materialDescription = value;
                            }
                        });
                    textarea.inputEl.rows = 3;
                    textarea.inputEl.addClass('spell-textarea');
                });
        }
    }

    private renderDescriptionSection(contentEl: HTMLElement) {
        contentEl.createEl('h3', { 
            text: i18n.t('SPELL_FIELDS.DESCRIPTION'),
            cls: 'spell-section-title'
        });

        const descriptionContainer = contentEl.createDiv('description-section');

        // Mana Cost
        new Setting(descriptionContainer)
            .setName(i18n.t('SPELL_FIELDS.MANA_COST'))
            .setDesc(i18n.t('SPELL_FIELDS.MANA_COST_DESC'))
            .addToggle(toggle => toggle
                .setValue(this.spellData.manaCost || false)
                .onChange(value => this.spellData.manaCost = value));

        // Description
        const descSetting = new Setting(descriptionContainer)
            .setName(i18n.t('SPELL_FIELDS.DESCRIPTION'))
            .setDesc(i18n.t('SPELL_FIELDS.DESCRIPTION_DESC'));
        
        const textArea = new TextAreaComponent(descSetting.controlEl);
        textArea.setPlaceholder(i18n.t('SPELL_FIELDS.DESCRIPTION_PLACEHOLDER'))
            .setValue(this.spellData.description || '')
            .onChange(value => this.spellData.description = value);
        textArea.inputEl.style.width = '100%';
        textArea.inputEl.rows = 6;
        textArea.inputEl.addClass('spell-textarea');

        // Cantrip Upgrade
        const upgradeSetting = new Setting(descriptionContainer)
            .setName(i18n.t('SPELL_FIELDS.CANTRIP_UPGRADE'))
            .setDesc(i18n.t('SPELL_FIELDS.CANTRIP_UPGRADE_DESC'));
        
        const upgradeTextArea = new TextAreaComponent(upgradeSetting.controlEl);
        upgradeTextArea.setPlaceholder(i18n.t('SPELL_FIELDS.CANTRIP_UPGRADE_PLACEHOLDER'))
            .setValue(this.spellData.cantripUpgrade || '')
            .onChange(value => this.spellData.cantripUpgrade = value);
        upgradeTextArea.inputEl.style.width = '100%';
        upgradeTextArea.inputEl.rows = 3;
        upgradeTextArea.inputEl.addClass('cantrip-upgrade-textarea');
    }

    private renderSaveButtons(contentEl: HTMLElement) {
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText(i18n.t('SPELL_MODAL.SAVE_BUTTON'))
                .setCta()
                .onClick(() => this.saveSpell()))
            .addButton(btn => btn
                .setButtonText(i18n.t('SPELL_MODAL.CANCEL_BUTTON'))
                .onClick(() => this.close()));
    }

    private async saveSpell() {
        if (!this.spellData.name?.trim()) {
            new Notice(i18n.t('SPELL_MODAL.VALIDATION_NAME'));
            return;
        }

        if (this.spellData.level === undefined) {
            new Notice(i18n.t('SPELL_MODAL.VALIDATION_LEVEL'));
            return;
        }

        if (!this.spellData.school) {
            new Notice(i18n.t('SPELL_MODAL.VALIDATION_SCHOOL'));
            return;
        }

        if (!this.spellData.classes || this.spellData.classes.length === 0) {
            new Notice(i18n.t('SPELL_MODAL.VALIDATION_CLASSES'));
            return;
        }

        const spellData = {
            name: this.spellData.name,
            level: this.spellData.level,
            school: i18n.getGameData('SPELL_SCHOOLS', this.spellData.school as SpellSchoolKey),
            classes: this.spellData.classes.map(cls => i18n.getGameData('SPELL_CLASSES', cls as SpellClassKey)),
            actionType: i18n.getGameData('ACTION_TYPES', this.spellData.actionType as ActionTypeKey),
            concentration: this.spellData.concentration || false,
            ritual: this.spellData.ritual || false,
            castingTime: this.spellData.castingTime || '',
            range: this.spellData.range || '',
            components: this.spellData.components || { verbal: false, somatic: false, material: false },
            duration: this.spellData.duration || '',
            description: this.spellData.description || '',
            cantripUpgrade: this.spellData.cantripUpgrade || '',
            manaCost: this.spellData.manaCost || false
        };

        try {
            const spell = await this.spellService.createSpell(spellData);
            this.onSave(spell);
            this.close();
            new Notice(i18n.t('SPELL_MODAL.SUCCESS', { name: spell.name }));
        } catch (error: any) {
            console.error('Error creating spell:', error);
            new Notice(i18n.t('SPELL_MODAL.ERROR', { message: error.message }));
        }
    }
}