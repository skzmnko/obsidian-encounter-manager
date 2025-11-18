import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { Spell } from 'src/models/Spells';
import { i18n } from 'src/services/LocalizationService';
import { SpellCreationModal } from '../modals/SpellCreationModal';

export const SPELLS_VIEW_TYPE = 'spells-view';

export class SpellsPanel extends ItemView {
    private spellService: any;
    private spells: Spell[] = [];
    private searchQuery: string = '';

    constructor(leaf: WorkspaceLeaf, spellService: any) {
        super(leaf);
        this.spellService = spellService;
    }

    getViewType(): string {
        return SPELLS_VIEW_TYPE;
    }

    getDisplayText(): string {
        return i18n.t('SPELLS.TITLE');
    }

    getIcon(): string {
        return "sparkles";
    }

    async onOpen() {
        await this.loadSpells();
        this.render();
    }

    async onClose() {
        // Cleanup if needed
    }

    private async loadSpells() {
        try {
            this.spells = this.spellService.getAllSpells();
            console.log(`Loaded ${this.spells.length} spells`);
        } catch (error) {
            console.error('Error loading spells:', error);
            this.spells = [];
        }
    }

    private render() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('spells-panel');

        // Header
        const header = container.createDiv('spells-header');
        header.createEl('h1', { text: i18n.t('SPELLS.TITLE') });

        // Controls
        const controls = header.createDiv('spells-controls');
        
        // Search
        const searchContainer = controls.createDiv('search-container');
        const searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: i18n.t('SPELLS.SEARCH_PLACEHOLDER'),
            cls: 'search-input'
        });
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
            this.renderSpellsList();
        });

        // Add Spell button
        const addButton = controls.createEl('button', {
            text: i18n.t('SPELLS.ADD_SPELL'),
            cls: 'mod-cta'
        });
        addButton.addEventListener('click', () => {
            this.openSpellCreationModal();
        });

        // Spells list container
        this.contentEl = container.createDiv('spells-content');
        this.renderSpellsList();
    }

    private renderSpellsList() {
        if (!this.contentEl) return;

        this.contentEl.empty();

        const filteredSpells = this.spells.filter(spell => 
            spell.name.toLowerCase().includes(this.searchQuery)
        );

        if (filteredSpells.length === 0) {
            const emptyState = this.contentEl.createDiv('empty-state');
            if (this.spells.length === 0) {
                emptyState.setText(i18n.t('SPELLS.NO_SPELLS'));
            } else {
                emptyState.setText(i18n.t('SPELLS.NO_SPELLS_FOUND'));
            }
            return;
        }

        // Group by first letter for alphabetical sections
        const groupedSpells: { [key: string]: Spell[] } = {};
        filteredSpells.forEach(spell => {
            const firstLetter = spell.name.charAt(0).toUpperCase();
            if (!groupedSpells[firstLetter]) {
                groupedSpells[firstLetter] = [];
            }
            groupedSpells[firstLetter].push(spell);
        });

        // Sort letters alphabetically
        const sortedLetters = Object.keys(groupedSpells).sort();

        sortedLetters.forEach(letter => {
            const section = this.contentEl.createDiv('spell-section');
            section.createEl('h2', { 
                text: letter, 
                cls: 'alphabet-section-header' 
            });

            groupedSpells[letter].forEach(spell => {
                this.renderSpellItem(section, spell);
            });
        });
    }

    private renderSpellItem(container: HTMLElement, spell: Spell) {
        const spellEl = container.createDiv('spell-item');
        spellEl.addClass('clickable-item');

        // Header with name and basic info
        const header = spellEl.createDiv('spell-header');
        header.createEl('h3', { text: spell.name });
        
        const details = header.createDiv('spell-details');
        const levelText = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
        details.setText(`${levelText} ${spell.school}`);

        // Quick info
        const info = spellEl.createDiv('spell-info');
        info.createDiv().setText(`${i18n.t('SPELL_FIELDS.CASTING_TIME')}: ${spell.castingTime}`);
        info.createDiv().setText(`${i18n.t('SPELL_FIELDS.RANGE')}: ${spell.range}`);
        info.createDiv().setText(`${i18n.t('SPELL_FIELDS.DURATION')}: ${spell.duration}`);

        // Components
        const components = [];
        if (spell.components.verbal) components.push('V');
        if (spell.components.somatic) components.push('S');
        if (spell.components.material) components.push('M');
        
        if (components.length > 0) {
            const componentsEl = spellEl.createDiv('spell-components');
            componentsEl.setText(`${i18n.t('SPELL_FIELDS.COMPONENTS')}: ${components.join(', ')}`);
        }

        // Classes
        const classes = spellEl.createDiv('spell-classes');
        classes.setText(`${i18n.t('SPELL_FIELDS.CLASSES')}: ${spell.classes.join(', ')}`);

        // Special flags
        const flags = [];
        if (spell.concentration) flags.push(i18n.t('SPELL_FIELDS.CONCENTRATION'));
        if (spell.ritual) flags.push(i18n.t('SPELL_FIELDS.RITUAL'));
        
        if (flags.length > 0) {
            const flagsEl = spellEl.createDiv('spell-flags');
            flagsEl.setText(flags.join(', '));
        }

        // Actions
        const actions = spellEl.createDiv('spell-actions');
        const editBtn = actions.createEl('button', { 
            text: i18n.t('SPELLS.EDIT'),
            cls: 'mod-warning'
        });
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            new Notice(i18n.t('SPELLS.EDIT_IN_PROGRESS', { name: spell.name }));
        });

        const deleteBtn = actions.createEl('button', { 
            text: i18n.t('SPELLS.DELETE'),
            cls: 'mod-danger'
        });
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteSpell(spell);
        });

        // Click to view details
        spellEl.addEventListener('click', () => {
            this.viewSpellDetails(spell);
        });
    }

    private async deleteSpell(spell: Spell) {
        const confirmed = confirm(
            i18n.t('SPELLS.DELETE_CONFIRM_SINGLE', { name: spell.name })
        );

        if (confirmed) {
            try {
                await this.spellService.deleteSpell(spell.id);
                await this.loadSpells();
                this.renderSpellsList();
                new Notice(i18n.t('SPELLS.DELETE_SUCCESS', { name: spell.name }));
            } catch (error: any) {
                console.error('Error deleting spell:', error);
                new Notice(`Error deleting spell: ${error.message}`);
            }
        }
    }

    private viewSpellDetails(spell: Spell) {
        new Notice(i18n.t('SPELLS.VIEW_IN_PROGRESS'));
    }

    private openSpellCreationModal() {
        try {
            const modal = new SpellCreationModal(this.app, this.spellService, async (spell: Spell) => {
                await this.loadSpells();
                this.renderSpellsList();
            });
            modal.open();
        } catch (error) {
            console.error('Error opening spell creation modal:', error);
            new Notice('Error opening spell creation modal');
        }
    }

    refreshLocalization() {
        this.render();
    }
}