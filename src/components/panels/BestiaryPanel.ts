import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { CreatureCreationModal } from 'src/components/modals/CreatureCreationModal';
import { i18n } from 'src/services/LocalizationService';

export const BESTIARY_VIEW_TYPE = 'bestiary-view';
export class BestiaryPanel extends ItemView {
    bestiaryService: any;
    creatures: Creature[] = [];
    private searchQuery: string = '';
    private searchInput: HTMLInputElement | null = null;

    constructor(leaf: WorkspaceLeaf, bestiaryService: any) {
        super(leaf);
        this.bestiaryService = bestiaryService;
    }

    getViewType(): string {
        return BESTIARY_VIEW_TYPE;
    }

    getDisplayText(): string {
        return i18n.t('BESTIARY.TITLE');
    }

    getIcon(): string {
        return 'dragon';
    }

    async onOpen() {
        await this.loadCreatures();
        this.render();
    }

    async onClose() {
    }

    async loadCreatures() {
        this.creatures = this.bestiaryService.getAllCreatures();
    }

    render() {
        const container = this.containerEl.children[1] as HTMLElement;
        container.empty();
        const header = container.createDiv({ cls: 'bestiary-header' });
        header.createEl('h2', { text: i18n.t('BESTIARY.TITLE') });

        const addButton = header.createEl('button', { 
            text: i18n.t('BESTIARY.ADD_CREATURE'),
            cls: 'mod-cta'
        });
        addButton.addEventListener('click', () => {
            this.openCreatureCreationModal();
        });

        const currentSearchValue = this.searchInput?.value || '';
        const selectionStart = this.searchInput?.selectionStart || 0;
        const selectionEnd = this.searchInput?.selectionEnd || 0;

        this.renderSearchBox(container);

        if (this.searchInput) {
            this.searchInput.value = currentSearchValue;
            this.searchInput.setSelectionRange(selectionStart, selectionEnd);
            
            setTimeout(() => {
                this.searchInput?.focus();
            }, 0);
        }

        const creaturesList = container.createDiv({ cls: 'bestiary-list' });
        const filteredCreatures = this.filterCreaturesByName(this.creatures, this.searchQuery);

        if (filteredCreatures.length === 0) {
            if (this.searchQuery) {
                creaturesList.createEl('p', { 
                    text: i18n.t('BESTIARY.SEARCH_NO_RESULTS', { query: this.searchQuery }),
                    cls: 'bestiary-empty'
                });
            } else {
                creaturesList.createEl('p', { 
                    text: i18n.t('BESTIARY.NO_CREATURES'),
                    cls: 'bestiary-empty'
                });
            }
            return;
        }

        const sortedCreatures = [...filteredCreatures].sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        const groupedCreatures = this.groupCreaturesByFirstLetter(sortedCreatures);
        
        this.renderGroupedCreaturesList(creaturesList, groupedCreatures);
    }

    private renderSearchBox(container: HTMLElement) {
        const searchContainer = container.createDiv({ cls: 'bestiary-search-container' });
        
        this.searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: i18n.t('BESTIARY.SEARCH_PLACEHOLDER'),
            cls: 'bestiary-search-input'
        });

        this.searchInput.value = this.searchQuery;

        let searchTimeout: NodeJS.Timeout;
        this.searchInput.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value.toLowerCase().trim();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = value;
                this.render();
            }, 300);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchQuery = '';
                if (this.searchInput) {
                    this.searchInput.value = '';
                }
                this.render();
                e.preventDefault();
            }
        });

        this.searchInput.addEventListener('blur', () => {
            if (this.searchInput) {
                this.searchQuery = this.searchInput.value.toLowerCase().trim();
            }
        });
    }

    private filterCreaturesByName(creatures: Creature[], searchQuery: string): Creature[] {
        if (!searchQuery) {
            return creatures;
        }

        return creatures.filter(creature => 
            creature.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    private groupCreaturesByFirstLetter(creatures: Creature[]): Map<string, Creature[]> {
        const groups = new Map<string, Creature[]>();
        
        creatures.forEach(creature => {
            const firstLetter = creature.name.charAt(0).toUpperCase();
            if (!groups.has(firstLetter)) {
                groups.set(firstLetter, []);
            }
            groups.get(firstLetter)!.push(creature);
        });
        
        return groups;
    }

    private renderGroupedCreaturesList(container: HTMLElement, groupedCreatures: Map<string, Creature[]>) {
        const sortedLetters = Array.from(groupedCreatures.keys()).sort();

        sortedLetters.forEach(letter => {
            const creatures = groupedCreatures.get(letter)!;
            const letterSection = container.createDiv({ cls: 'bestiary-letter-section' });
            letterSection.createEl('h3', { 
                text: letter,
                cls: 'bestiary-letter-header'
            });

            const creaturesContainer = letterSection.createDiv({ cls: 'bestiary-creatures-container' });
            
            creatures.forEach(creature => {
                this.renderCreatureListItem(creaturesContainer, creature);
            });
        });
    }

    private renderCreatureListItem(container: HTMLElement, creature: Creature) {
        const creatureEl = container.createDiv({ cls: 'creature-list-item' });
        
        const nameRow = creatureEl.createDiv({ cls: 'creature-name-row' });
        const nameLink = nameRow.createEl('a', { 
            text: creature.name,
            cls: 'creature-name-link'
        });
        
        nameLink.addEventListener('click', () => {
            new Notice(i18n.t('BESTIARY.VIEW_IN_PROGRESS'));
        });

        const detailsRow = creatureEl.createDiv({ cls: 'creature-details-row' });
        const detailsText = i18n.t('BESTIARY.CREATURE_DETAILS', {
            type: creature.type,
            size: creature.size,
            bonus: creature.proficiency_bonus.toString()
        });
        detailsRow.createEl('span', { 
            text: detailsText,
            cls: 'creature-details'
        });
        
        const actions = creatureEl.createDiv({ cls: 'creature-actions' });
        const editBtn = actions.createEl('button', { 
            text: i18n.t('BESTIARY.EDIT'),
            cls: 'mod-secondary'
        });
        editBtn.addEventListener('click', () => {
            new Notice(i18n.t('BESTIARY.EDIT_IN_PROGRESS'));
        });

        const deleteBtn = actions.createEl('button', { 
            text: i18n.t('BESTIARY.DELETE'),
            cls: 'mod-warning'
        });
        deleteBtn.addEventListener('click', async () => {
            const success = await this.bestiaryService.deleteCreature(creature.id);
            if (success) {
                new Notice(i18n.t('BESTIARY.DELETE_SUCCESS', { name: creature.name }));
                await this.loadCreatures();
                this.render();
            }
        });
    }

    openCreatureCreationModal() {
        const onSave = async (creature: Creature) => {
            await this.loadCreatures();
            this.render();
        };

        new CreatureCreationModal(this.app, this.bestiaryService, onSave).open();
    }
}