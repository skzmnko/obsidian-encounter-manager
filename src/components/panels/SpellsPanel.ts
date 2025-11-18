import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { Spell } from 'src/models/Spells';
import { i18n } from 'src/services/LocalizationService';
import { SpellCreationModal } from 'src/components/modals/SpellCreationModal';

export const SPELLS_VIEW_TYPE = 'spells-view';

export class SpellsPanel extends ItemView {
    private spellService: any;
    private spells: Spell[] = [];
    private searchQuery: string = '';
    private searchInput: HTMLInputElement | null = null;
    private addButton: HTMLButtonElement | null = null;
    private titleElement: HTMLElement | null = null;

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
        i18n.onLocaleChange(this.refreshLocalization);
        
        await this.loadSpells();
        this.render();
    }

    async onClose() {
        i18n.offLocaleChange(this.refreshLocalization);
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

    render() {
        const container = this.containerEl.children[1] as HTMLElement;
        container.empty();
        container.addClass('spells-panel');
        
        const header = container.createDiv({ cls: 'spells-header' });
        this.titleElement = header.createEl('h2', { 
            text: i18n.t('SPELLS.TITLE'),
            cls: 'spells-title'
        });

        this.renderControls(header);
        this.renderSpellsList(container);
    }

    private renderControls(container: HTMLElement) {
        const controlsSection = container.createDiv({ cls: 'spells-controls' });
        
        const searchContainer = controlsSection.createDiv({ cls: 'search-container' });
        this.searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: i18n.t('SPELLS.SEARCH_PLACEHOLDER'),
            cls: 'search-input'
        });
        this.searchInput.addEventListener('input', () => {
            this.filterSpells();
        });

        const buttonsContainer = controlsSection.createDiv({ cls: 'action-buttons-container' });
        
        this.addButton = buttonsContainer.createEl('button', { 
            text: i18n.t('SPELLS.ADD_SPELL'),
            cls: 'mod-cta'
        });
        this.addButton.addEventListener('click', () => {
            this.openSpellCreationModal();
        });
    }

    private renderSpellsList(container: HTMLElement) {
        const spellsList = container.createDiv({ cls: 'spells-list' });

        if (this.spells.length === 0) {
            spellsList.createEl('p', { 
                text: i18n.t('SPELLS.NO_SPELLS'),
                cls: 'spells-empty'
            });
            return;
        }

        const filteredSpells = this.getFilteredSpells();
        
        if (filteredSpells.length === 0) {
            spellsList.createEl('p', { 
                text: i18n.t('SPELLS.NO_SPELLS_FOUND'),
                cls: 'spells-empty'
            });
            return;
        }

        const sortedSpells = [...filteredSpells].sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        const groupedSpells = this.groupSpellsByFirstLetter(sortedSpells);
        this.renderGroupedSpellsList(spellsList, groupedSpells);
    }

    refreshLocalization = () => {
        if (this.titleElement) {
            this.titleElement.setText(i18n.t('SPELLS.TITLE'));
        }

        if (this.searchInput) {
            this.searchInput.setAttribute('placeholder', i18n.t('SPELLS.SEARCH_PLACEHOLDER'));
        }

        if (this.addButton) {
            this.addButton.setText(i18n.t('SPELLS.ADD_SPELL'));
        }

        const spellsList = this.containerEl.querySelector('.spells-list');
        if (spellsList) {
            spellsList.empty();
            this.renderSpellsList(spellsList as HTMLElement);
        }

        if (this.searchInput && this.searchInput.value) {
            this.filterSpells();
        }
    };

    private filterSpells() {
        if (!this.searchInput) return;
        
        const searchTerm = this.searchInput.value.toLowerCase();
        this.searchQuery = searchTerm;

        const container = this.containerEl.children[1] as HTMLElement;
        const spellsList = container.querySelector('.spells-list');
        if (spellsList) {
            spellsList.empty();
            this.renderSpellsList(spellsList as HTMLElement);
        }
    }

    private getFilteredSpells(): Spell[] {
        if (!this.searchQuery) {
            return this.spells;
        }
        
        return this.spells.filter(spell => 
            spell.name.toLowerCase().includes(this.searchQuery)
        );
    }

    private groupSpellsByFirstLetter(spells: Spell[]): Map<string, Spell[]> {
        const groups = new Map<string, Spell[]>();
        
        spells.forEach(spell => {
            const firstLetter = spell.name.charAt(0).toUpperCase();
            if (!groups.has(firstLetter)) {
                groups.set(firstLetter, []);
            }
            groups.get(firstLetter)!.push(spell);
        });
        
        return groups;
    }

    private renderGroupedSpellsList(container: HTMLElement, groupedSpells: Map<string, Spell[]>) {
        const sortedLetters = Array.from(groupedSpells.keys()).sort();

        sortedLetters.forEach(letter => {
            const spells = groupedSpells.get(letter)!;
            const letterSection = container.createDiv({ cls: 'spells-letter-section' });
            letterSection.createEl('h3', { 
                text: letter,
                cls: 'spells-letter-header'
            });

            const spellsContainer = letterSection.createDiv({ cls: 'spells-container' });
            
            spells.forEach(spell => {
                this.renderSpellListItem(spellsContainer, spell);
            });
        });
    }

    private renderSpellListItem(container: HTMLElement, spell: Spell) {
        const spellEl = container.createDiv({ cls: 'spell-list-item' });
        
        const spellContent = spellEl.createDiv({ cls: 'spell-content' });
        
        const nameRow = spellContent.createDiv({ cls: 'spell-name-row' });
        const nameLink = nameRow.createEl('a', { 
            text: spell.name,
            cls: 'spell-name-link'
        });
        
        nameLink.addEventListener('click', () => {
            this.viewSpellDetails(spell);
        });

        const detailsRow = spellContent.createDiv({ cls: 'spell-details-row' });
        
        // Level and school
        const levelText = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
        const basicInfo = detailsRow.createEl('span', { 
            text: `${levelText} ${spell.school}`,
            cls: 'spell-basic-info'
        });

        // Casting time and range
        const castingInfo = detailsRow.createEl('span', { 
            text: ` • ${spell.castingTime} • ${spell.range}`,
            cls: 'spell-casting-info'
        });

        // Components
        const components = [];
        if (spell.components.verbal) components.push('V');
        if (spell.components.somatic) components.push('S');
        if (spell.components.material) components.push('M');
        
        if (components.length > 0) {
            const componentsInfo = detailsRow.createEl('span', { 
                text: ` • ${components.join(', ')}`,
                cls: 'spell-components-info'
            });
        }

        // Special flags
        const flags = [];
        if (spell.concentration) flags.push(i18n.t('SPELL_FIELDS.CONCENTRATION'));
        if (spell.ritual) flags.push(i18n.t('SPELL_FIELDS.RITUAL'));
        
        if (flags.length > 0) {
            const flagsInfo = detailsRow.createEl('span', { 
                text: ` • ${flags.join(', ')}`,
                cls: 'spell-flags-info'
            });
        }

        // Actions container
        const actions = spellEl.createDiv({ cls: 'spell-actions' });
        
        const editBtn = actions.createEl('button', { 
            text: i18n.t('SPELLS.EDIT'),
            cls: 'mod-secondary'
        });
        
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            new Notice(i18n.t('SPELLS.EDIT_IN_PROGRESS', { name: spell.name }));
        });

        const deleteBtn = actions.createEl('button', { 
            text: i18n.t('SPELLS.DELETE'),
            cls: 'mod-warning'
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteSpell(spell);
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
                this.render();
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
                this.render();
            });
            modal.open();
        } catch (error) {
            console.error('Error opening spell creation modal:', error);
            new Notice('Error opening spell creation modal');
        }
    }
}