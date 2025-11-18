import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { CreatureCreationModal } from 'src/components/modals/CreatureCreationModal';
import { i18n } from 'src/services/LocalizationService';

export const BESTIARY_VIEW_TYPE = 'bestiary-view';

export class BestiaryPanel extends ItemView {
    bestiaryService: any;
    creatures: Creature[] = [];
    selectedCreatures: Set<string> = new Set();
    searchInput: HTMLInputElement | null = null;
    editButton: HTMLButtonElement | null = null;
    deleteButton: HTMLButtonElement | null = null;
    addButton: HTMLButtonElement | null = null;
    titleElement: HTMLElement | null = null;

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
        return 'feather';
    }

    async onOpen() {
        i18n.onLocaleChange(this.refreshLocalization);
        
        await this.loadCreatures();
        this.render();
    }

    async onClose() {
        i18n.offLocaleChange(this.refreshLocalization);
    }

    async loadCreatures() {
        this.creatures = this.bestiaryService.getAllCreatures();
    }

    render() {
        const container = this.containerEl.children[1] as HTMLElement;
        container.empty();
        
        const header = container.createDiv({ cls: 'bestiary-header' });
        this.titleElement = header.createEl('h2', { 
            text: i18n.t('BESTIARY.TITLE'),
            cls: 'bestiary-title'
        });

        this.renderControls(header);
        this.renderCreaturesList(container);
    }

    private renderControls(container: HTMLElement) {
        const controlsSection = container.createDiv({ cls: 'bestiary-controls' });
        
        const searchContainer = controlsSection.createDiv({ cls: 'search-container' });
        this.searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: i18n.t('BESTIARY.SEARCH_PLACEHOLDER'),
            cls: 'search-input'
        });
        this.searchInput.addEventListener('input', () => {
            this.filterCreatures();
        });

        const buttonsContainer = controlsSection.createDiv({ cls: 'action-buttons-container' });
        
        this.addButton = buttonsContainer.createEl('button', { 
            text: i18n.t('BESTIARY.ADD_CREATURE'),
            cls: 'mod-cta'
        });
        this.addButton.addEventListener('click', () => {
            this.openCreatureCreationModal();
        });

        this.editButton = buttonsContainer.createEl('button', { 
            text: i18n.t('BESTIARY.EDIT'),
            cls: 'mod-secondary'
        });
        this.editButton.disabled = true;
        this.editButton.addEventListener('click', () => {
            this.handleEditClick();
        });

        this.deleteButton = buttonsContainer.createEl('button', { 
            text: i18n.t('BESTIARY.DELETE'),
            cls: 'mod-warning'
        });
        this.deleteButton.disabled = true;
        this.deleteButton.addEventListener('click', () => {
            this.handleDeleteClick();
        });

        this.updateButtonsState();
    }

    private renderCreaturesList(container: HTMLElement) {
        const creaturesList = container.createDiv({ cls: 'bestiary-list' });

        if (this.creatures.length === 0) {
            creaturesList.createEl('p', { 
                text: i18n.t('BESTIARY.NO_CREATURES'),
                cls: 'bestiary-empty'
            });
            return;
        }

        const sortedCreatures = [...this.creatures].sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        const groupedCreatures = this.groupCreaturesByFirstLetter(sortedCreatures);
        
        this.renderGroupedCreaturesList(creaturesList, groupedCreatures);
    }

    refreshLocalization = () => {
        if (this.titleElement) {
            this.titleElement.setText(i18n.t('BESTIARY.TITLE'));
        }

        if (this.searchInput) {
            this.searchInput.setAttribute('placeholder', i18n.t('BESTIARY.SEARCH_PLACEHOLDER'));
        }

        if (this.addButton) {
            this.addButton.setText(i18n.t('BESTIARY.ADD_CREATURE'));
        }
        if (this.editButton) {
            this.editButton.setText(i18n.t('BESTIARY.EDIT'));
        }
        if (this.deleteButton) {
            this.deleteButton.setText(i18n.t('BESTIARY.DELETE'));
        }

        const creaturesList = this.containerEl.querySelector('.bestiary-list');
        if (creaturesList && this.creatures.length === 0) {
            creaturesList.empty();
            const emptyMessage = creaturesList.createEl('p', { 
                text: i18n.t('BESTIARY.NO_CREATURES'),
                cls: 'bestiary-empty'
            });
        }

        if (this.searchInput && this.searchInput.value) {
            this.filterCreatures();
        }
    };

    private filterCreatures() {
        if (!this.searchInput) return;
        
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredCreatures = this.creatures.filter(creature => 
            creature.name.toLowerCase().includes(searchTerm)
        );

        const container = this.containerEl.children[1] as HTMLElement;
        const creaturesList = container.querySelector('.bestiary-list');
        if (creaturesList) {
            creaturesList.empty();
            
            if (filteredCreatures.length === 0) {
                creaturesList.createEl('p', { 
                    text: i18n.t('BESTIARY.NO_CREATURES_FOUND'),
                    cls: 'bestiary-empty'
                });
                return;
            }

            const sortedFilteredCreatures = [...filteredCreatures].sort((a, b) => 
                a.name.localeCompare(b.name)
            );

            const groupedCreatures = this.groupCreaturesByFirstLetter(sortedFilteredCreatures);
            this.renderGroupedCreaturesList(creaturesList as HTMLElement, groupedCreatures);
        }
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
        
        const checkboxContainer = creatureEl.createDiv({ cls: 'creature-checkbox-container' });
        const checkbox = checkboxContainer.createEl('input', {
            type: 'checkbox',
            cls: 'creature-checkbox'
        }) as HTMLInputElement;
        
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                this.selectedCreatures.add(creature.id);
            } else {
                this.selectedCreatures.delete(creature.id);
            }
            this.updateButtonsState();
        });

        const creatureContent = creatureEl.createDiv({ cls: 'creature-content' });
        
        const nameRow = creatureContent.createDiv({ cls: 'creature-name-row' });
        const nameLink = nameRow.createEl('a', { 
            text: creature.name,
            cls: 'creature-name-link'
        });
        
        nameLink.addEventListener('click', () => {
            new Notice(i18n.t('BESTIARY.VIEW_IN_PROGRESS'));
        });

        const detailsRow = creatureContent.createDiv({ cls: 'creature-details-row' });
        const detailsText = i18n.t('BESTIARY.CREATURE_DETAILS', {
            type: creature.type,
            size: creature.size,
            bonus: creature.proficiency_bonus.toString()
        });
        detailsRow.createEl('span', { 
            text: detailsText,
            cls: 'creature-details'
        });
    }

    private updateButtonsState() {
        if (this.editButton && this.deleteButton) {
            const hasSelection = this.selectedCreatures.size > 0;
            this.editButton.disabled = !hasSelection;
            this.deleteButton.disabled = !hasSelection;
        }
    }

    private handleEditClick() {
        if (this.selectedCreatures.size === 0) {
            return;
        }

        if (this.selectedCreatures.size > 1) {
            new Notice(i18n.t('BESTIARY.EDIT_SINGLE_ONLY'));
            return;
        }

        const creatureId = Array.from(this.selectedCreatures)[0];
        const creature = this.creatures.find(c => c.id === creatureId);
        
        if (creature) {
            new Notice(i18n.t('BESTIARY.EDIT_IN_PROGRESS', { name: creature.name }));
            // TODO: Implement edit functionality
            // this.openCreatureEditModal(creature);
        }
    }

    private async handleDeleteClick() {
        if (this.selectedCreatures.size === 0) {
            return;
        }

        const selectedNames: string[] = [];
        const creaturesToDelete: Creature[] = [];

        this.selectedCreatures.forEach(id => {
            const creature = this.creatures.find(c => c.id === id);
            if (creature) {
                selectedNames.push(creature.name);
                creaturesToDelete.push(creature);
            }
        });

        if (selectedNames.length === 0) {
            return;
        }

        const confirmMessage = this.selectedCreatures.size === 1 
            ? i18n.t('BESTIARY.DELETE_CONFIRM_SINGLE', { name: selectedNames[0] })
            : i18n.t('BESTIARY.DELETE_CONFIRM_MULTIPLE', { count: selectedNames.length.toString() });

        if (!confirm(confirmMessage)) {
            return;
        }

        let successCount = 0;
        for (const creature of creaturesToDelete) {
            const success = await this.bestiaryService.deleteCreature(creature.id);
            if (success) {
                successCount++;
            }
        }

        if (successCount > 0) {
            const successMessage = successCount === 1 
                ? i18n.t('BESTIARY.DELETE_SUCCESS', { name: selectedNames[0] })
                : i18n.t('BESTIARY.DELETE_SUCCESS_MULTIPLE', { count: successCount.toString() });
            
            new Notice(successMessage);
            this.selectedCreatures.clear();
            await this.loadCreatures();
            this.render();
        }
    }

    openCreatureCreationModal() {
        const onSave = async (creature: Creature) => {
            await this.loadCreatures();
            this.render();
        };

        new CreatureCreationModal(this.app, this.bestiaryService, onSave).open();
    }
}