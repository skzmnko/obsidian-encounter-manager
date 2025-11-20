import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
import { Spell } from "src/models/Spells";
import { i18n } from "src/services/LocalizationService";
import { SpellCreationModal } from "src/components/modals/SpellCreationModal";
import { SPELL_SCHOOLS } from "src/constants/Constants";

export const SPELLS_VIEW_TYPE = "spells-view";

export class SpellsPanel extends ItemView {
  private spellService: any;
  private spells: Spell[] = [];
  private searchQuery: string = "";
  private searchInput: HTMLInputElement | null = null;
  private addButton: HTMLButtonElement | null = null;
  private editButton: HTMLButtonElement | null = null;
  private deleteButton: HTMLButtonElement | null = null;
  private titleElement: HTMLElement | null = null;
  private selectedSpellIds: Set<string> = new Set();

  constructor(leaf: WorkspaceLeaf, spellService: any) {
    super(leaf);
    this.spellService = spellService;
  }

  getViewType(): string {
    return SPELLS_VIEW_TYPE;
  }

  getDisplayText(): string {
    return i18n.t("SPELLS.TITLE");
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
      console.log("Sample spell:", this.spells[0]); // Для отладки
    } catch (error) {
      console.error("Error loading spells:", error);
      this.spells = [];
    }
  }

  render() {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    container.addClass("spells-panel");

    const header = container.createDiv({ cls: "spells-header" });
    this.titleElement = header.createEl("h2", {
      text: i18n.t("SPELLS.TITLE"),
      cls: "spells-title",
    });

    this.renderControls(header);
    this.renderSpellsList(container);
  }

  private renderControls(container: HTMLElement) {
    const controlsSection = container.createDiv({ cls: "spells-controls" });

    const searchContainer = controlsSection.createDiv({
      cls: "search-container",
    });
    this.searchInput = searchContainer.createEl("input", {
      type: "text",
      placeholder: i18n.t("SPELLS.SEARCH_PLACEHOLDER"),
      cls: "search-input",
    });
    this.searchInput.addEventListener("input", () => {
      this.filterSpells();
    });

    const buttonsContainer = controlsSection.createDiv({
      cls: "action-buttons-container",
    });

    this.addButton = buttonsContainer.createEl("button", {
      text: i18n.t("SPELLS.ADD_SPELL"),
      cls: "mod-cta",
    });
    this.addButton.addEventListener("click", () => {
      this.openSpellCreationModal();
    });

    this.editButton = buttonsContainer.createEl("button", {
      text: i18n.t("SPELLS.EDIT"),
      cls: "mod-secondary",
    });
    this.editButton.addEventListener("click", () => {
      this.editSelectedSpells();
    });
    this.editButton.disabled = true;

    this.deleteButton = buttonsContainer.createEl("button", {
      text: i18n.t("SPELLS.DELETE"),
      cls: "mod-warning",
    });
    this.deleteButton.addEventListener("click", () => {
      this.deleteSelectedSpells();
    });
    this.deleteButton.disabled = true;
  }

  private renderSpellsList(container: HTMLElement) {
    const spellsList = container.createDiv({ cls: "spells-list" });

    if (this.spells.length === 0) {
      spellsList.createEl("p", {
        text: i18n.t("SPELLS.NO_SPELLS"),
        cls: "spells-empty",
      });
      return;
    }

    const filteredSpells = this.getFilteredSpells();

    if (filteredSpells.length === 0) {
      spellsList.createEl("p", {
        text: i18n.t("SPELLS.NO_SPELLS_FOUND"),
        cls: "spells-empty",
      });
      return;
    }

    const sortedSpells = this.sortSpellsByLevelAndName(filteredSpells);
    const groupedSpells = this.groupSpellsBySchool(sortedSpells);
    this.renderGroupedSpellsList(spellsList, groupedSpells);
  }

  refreshLocalization = () => {
    if (this.titleElement) {
      this.titleElement.setText(i18n.t("SPELLS.TITLE"));
    }

    if (this.searchInput) {
      this.searchInput.setAttribute(
        "placeholder",
        i18n.t("SPELLS.SEARCH_PLACEHOLDER"),
      );
    }

    if (this.addButton) {
      this.addButton.setText(i18n.t("SPELLS.ADD_SPELL"));
    }

    if (this.editButton) {
      this.editButton.setText(i18n.t("SPELLS.EDIT"));
    }

    if (this.deleteButton) {
      this.deleteButton.setText(i18n.t("SPELLS.DELETE"));
    }

    const spellsList = this.containerEl.querySelector(".spells-list");
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
    const spellsList = container.querySelector(".spells-list");
    if (spellsList) {
      spellsList.empty();
      this.renderSpellsList(spellsList as HTMLElement);
    }
  }

  private getFilteredSpells(): Spell[] {
    if (!this.searchQuery) {
      return this.spells;
    }

    return this.spells.filter((spell) =>
      spell.name.toLowerCase().includes(this.searchQuery),
    );
  }

  private sortSpellsByLevelAndName(spells: Spell[]): Spell[] {
    return [...spells].sort((a, b) => {
      // Сначала сортируем по уровню (заклинания с уровнем 0 - заговоры - первыми)
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      // Если уровень одинаковый, сортируем по названию
      return a.name.localeCompare(b.name);
    });
  }

  private groupSpellsBySchool(spells: Spell[]): Map<string, Spell[]> {
    const groups = new Map<string, Spell[]>();

    SPELL_SCHOOLS.forEach((schoolKey) => {
      const localizedSchool = i18n.getSpellSchool(schoolKey);
      const schoolSpells = spells.filter(
        (spell) => spell.school === localizedSchool,
      );
      groups.set(schoolKey, schoolSpells);
    });

    return groups;
  }

  private renderGroupedSpellsList(
    container: HTMLElement,
    groupedSpells: Map<string, Spell[]>,
  ) {
    const sortedSchools = Array.from(groupedSpells.keys()).sort((a, b) => {
      const indexA = SPELL_SCHOOLS.indexOf(a as any);
      const indexB = SPELL_SCHOOLS.indexOf(b as any);
      return indexA - indexB;
    });

    const sectionsHeader = container.createEl("h3", {
      text: i18n.t("SPELLS.SCHOOL_SECTIONS"),
      cls: "spells-sections-header",
    });

    sortedSchools.forEach((schoolKey) => {
      const spells = groupedSpells.get(schoolKey)!;
      const schoolSection = container.createDiv({
        cls: "spells-school-section",
      });

      const schoolHeader = schoolSection.createEl("h4", {
        text: i18n.getSpellSchool(schoolKey as any),
        cls: "spells-school-header",
      });

      const spellsContainer = schoolSection.createDiv({
        cls: "spells-container",
      });

      if (spells.length === 0) {
        const noSpellsMessage = spellsContainer.createEl("p", {
          text: "—",
          cls: "spells-school-empty",
        });
      } else {
        spells.forEach((spell) => {
          this.renderSpellListItem(spellsContainer, spell);
        });
      }
    });
  }

  private renderSpellListItem(container: HTMLElement, spell: Spell) {
    const spellEl = container.createDiv({ cls: "spell-list-item" });
    const checkboxContainer = spellEl.createDiv({
      cls: "spell-checkbox-container",
    });
    const checkbox = checkboxContainer.createEl("input", {
      type: "checkbox",
      cls: "spell-checkbox",
    });
    checkbox.checked = this.selectedSpellIds.has(spell.id);
    checkbox.addEventListener("change", () => {
      this.toggleSpellSelection(spell.id, checkbox.checked);
    });

    const spellContent = spellEl.createDiv({ cls: "spell-content" });

    const nameRow = spellContent.createDiv({ cls: "spell-name-row" });
    const nameLink = nameRow.createEl("a", {
      text: spell.name,
      cls: "spell-name-link",
    });

    nameLink.addEventListener("click", () => {
      this.viewSpellDetails(spell);
    });

    const detailsRow = spellContent.createDiv({ cls: "spell-details-row" });
    const levelText =
      spell.level === 0
        ? i18n.t("SPELL_FIELDS.CANTRIP")
        : `${i18n.t("SPELL_FIELDS.SPELLEVEL")} ${spell.level}`;

    const basicInfo = detailsRow.createEl("span", {
      text: `${levelText}`,
      cls: "spell-basic-info",
    });

    if (spell.classes && spell.classes.length > 0) {
      const classesInfo = detailsRow.createEl("span", {
        text: ` | ${spell.classes.map((className) => i18n.getSpellClass(className as any)).join(", ")}`,
        cls: "spell-classes-info",
      });
    }

    const castingInfo = detailsRow.createEl("span", {
      text: ` | ${spell.castingTime}`,
      cls: "spell-casting-info",
    });

    const components = [];
    if (spell.components.verbal) components.push("V");
    if (spell.components.somatic) components.push("S");
    if (spell.components.material) components.push("M");

    if (components.length > 0) {
      const componentsInfo = detailsRow.createEl("span", {
        text: ` | ${components.join(", ")}`,
        cls: "spell-components-info",
      });
    }

    const flags = [];
    if (spell.concentration) flags.push(i18n.t("SPELL_FIELDS.CONCENTRATION"));
    if (spell.ritual) flags.push(i18n.t("SPELL_FIELDS.RITUAL"));

    if (flags.length > 0) {
      const flagsInfo = detailsRow.createEl("span", {
        text: ` | ${flags.join(", ")}`,
        cls: "spell-flags-info",
      });
    }
  }

  private toggleSpellSelection(spellId: string, selected: boolean) {
    if (selected) {
      this.selectedSpellIds.add(spellId);
    } else {
      this.selectedSpellIds.delete(spellId);
    }
    this.updateActionButtonsState();
  }

  private updateActionButtonsState() {
    const hasSelection = this.selectedSpellIds.size > 0;

    if (this.editButton) {
      this.editButton.disabled = !hasSelection;
    }

    if (this.deleteButton) {
      this.deleteButton.disabled = !hasSelection;
    }
  }

  private editSelectedSpells() {
    const selectedCount = this.selectedSpellIds.size;
    if (selectedCount === 0) return;

    if (selectedCount > 1) {
      new Notice(i18n.t("SPELLS.EDIT_SINGLE_ONLY"));
      return;
    }

    const spellId = Array.from(this.selectedSpellIds)[0];
    const spell = this.spells.find((s) => s.id === spellId);
    if (spell) {
      new Notice(i18n.t("SPELLS.EDIT_IN_PROGRESS", { name: spell.name }));
      // TODO: Implement single spell editing
    }
  }

  private async deleteSelectedSpells() {
    const selectedCount = this.selectedSpellIds.size;
    if (selectedCount === 0) return;

    let confirmMessage: string;
    if (selectedCount === 1) {
      const spellId = Array.from(this.selectedSpellIds)[0];
      const spell = this.spells.find((s) => s.id === spellId);
      confirmMessage = i18n.t("SPELLS.DELETE_CONFIRM_SINGLE", {
        name: spell?.name || "",
      });
    } else {
      confirmMessage = i18n.t("SPELLS.DELETE_CONFIRM_MULTIPLE", {
        count: selectedCount.toString(),
      });
    }

    const confirmed = confirm(confirmMessage);

    if (confirmed) {
      try {
        for (const spellId of this.selectedSpellIds) {
          await this.spellService.deleteSpell(spellId);
        }

        this.selectedSpellIds.clear();
        await this.loadSpells();
        this.render();

        if (selectedCount === 1) {
          const spellId = Array.from(this.selectedSpellIds)[0];
          const spell = this.spells.find((s) => s.id === spellId);
          new Notice(
            i18n.t("SPELLS.DELETE_SUCCESS", { name: spell?.name || "" }),
          );
        } else {
          new Notice(
            i18n.t("SPELLS.DELETE_MULTIPLE_SUCCESS", {
              count: selectedCount.toString(),
            }),
          );
        }
      } catch (error: any) {
        console.error("Error deleting spells:", error);
        new Notice(`Error deleting spells: ${error.message}`);
      }
    }
  }

  private viewSpellDetails(spell: Spell) {
    new Notice(i18n.t("SPELLS.VIEW_IN_PROGRESS"));
  }

  private openSpellCreationModal() {
    try {
      const modal = new SpellCreationModal(
        this.app,
        this.spellService,
        async (spell: Spell) => {
          await this.loadSpells();
          this.render();
        },
      );
      modal.open();
    } catch (error) {
      console.error("Error opening spell creation modal:", error);
      new Notice("Error opening spell creation modal");
    }
  }
}