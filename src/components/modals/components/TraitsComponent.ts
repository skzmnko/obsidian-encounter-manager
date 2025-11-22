import { Setting, Notice } from "obsidian";
import { CreatureTrait } from "src/models/Bestiary";
import { i18n } from "src/services/LocalizationService";

export class TraitsComponent {
  private traits: CreatureTrait[] = [];
  private newTraitName: string = "";
  private newTraitDesc: string = "";
  private usesSpells: boolean = false;
  private traitNameInput: HTMLInputElement | null = null;
  private spellCountingMode: "uses" | "slots" = "uses";
  private spellCountingContainer: HTMLElement | null = null;
  private spellOptionsContainer: HTMLElement | null = null;

  private usesOptions = [
    { 
      id: "unlimited", 
      label: i18n.t("TRAITS.USES_OPTIONS.UNLIMITED"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "once_per_day", 
      label: i18n.t("TRAITS.USES_OPTIONS.ONCE_PER_DAY"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "twice_per_day", 
      label: i18n.t("TRAITS.USES_OPTIONS.TWICE_PER_DAY"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "thrice_per_day", 
      label: i18n.t("TRAITS.USES_OPTIONS.THRICE_PER_DAY"), 
      checked: false, 
      spell: "" 
    },
  ];

  private slotsOptions = [
    {
      id: "cantrips",
      label: i18n.t("TRAITS.SLOTS_OPTIONS.CANTRIPS"),
      checked: false,
      spell: "",
    },
    { 
      id: "level1", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_1"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level2", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_2"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level3", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_3"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level4", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_4"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level5", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_5"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level6", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_6"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level7", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_7"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level8", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_8"), 
      checked: false, 
      spell: "" 
    },
    { 
      id: "level9", 
      label: i18n.t("TRAITS.SLOTS_OPTIONS.LEVEL_9"), 
      checked: false, 
      spell: "" 
    },
  ];

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });
    section.createEl("h3", {
      text: i18n.t("TRAITS.TITLE"),
      cls: "section-title",
    });

    this.renderAddTraitForm(section);
    this.renderTraitsList(section);
  }

  private renderAddTraitForm(container: HTMLElement) {
    const addTraitContainer = container.createDiv({
      cls: "add-trait-container",
    });

    const nameSetting = new Setting(addTraitContainer)
      .setName(i18n.t("TRAITS.TRAIT_NAME"))
      .setDesc(i18n.t("TRAITS.TRAIT_NAME_DESC"))
      .addText((text) => {
        text
          .setPlaceholder(i18n.t("TRAITS.TRAIT_NAME_PLACEHOLDER"))
          .onChange((value) => (this.newTraitName = value));
        this.traitNameInput = text.inputEl;
      });

    new Setting(addTraitContainer)
      .setName(i18n.t("TRAITS.TRAIT_DESC"))
      .setDesc(i18n.t("TRAITS.TRAIT_DESC_DESC"))
      .addTextArea((text) => {
        text
          .setPlaceholder(i18n.t("TRAITS.TRAIT_DESC_PLACEHOLDER"))
          .onChange((value) => (this.newTraitDesc = value));
        text.inputEl.addClass("trait-desc-textarea");
        text.inputEl.addClass("wide-textarea");
      });

    new Setting(addTraitContainer)
      .setName(i18n.t("TRAITS.USES_SPELLS"))
      .setDesc(i18n.t("TRAITS.USES_SPELLS_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.usesSpells)
          .onChange((value) => this.onUsesSpellsChange(value)),
      );

    this.spellCountingContainer = addTraitContainer.createDiv({
      cls: "spell-counting-container",
    });
    this.spellCountingContainer.style.display = "none";

    this.renderSpellCountingMode();

    this.spellOptionsContainer = addTraitContainer.createDiv({
      cls: "spell-options-container",
    });
    this.spellOptionsContainer.style.display = "none";

    new Setting(addTraitContainer).addButton((btn) =>
      btn
        .setButtonText(i18n.t("TRAITS.ADD_TRAIT"))
        .setCta()
        .onClick(() => {
          if (!this.newTraitName.trim()) {
            new Notice(i18n.t("TRAITS.VALIDATION"));
            return;
          }

          if (this.traits.length >= 10) {
            new Notice(i18n.t("TRAITS.MAX_REACHED"));
            return;
          }

          const newTrait: CreatureTrait = {
            name: this.newTraitName,
            desc: this.newTraitDesc,
          };

          this.traits.push(newTrait);
          this.newTraitName = "";
          this.newTraitDesc = "";
          this.usesSpells = false;
          this.spellCountingMode = "uses";
          this.resetSpellOptions();

          if (this.traitNameInput) {
            this.traitNameInput.value = "";
            this.traitNameInput.readOnly = false;
            this.traitNameInput.placeholder = i18n.t(
              "TRAITS.TRAIT_NAME_PLACEHOLDER",
            );
          }

          const descInput = addTraitContainer.querySelector(
            "textarea",
          ) as HTMLTextAreaElement;
          if (descInput) descInput.value = "";

          const toggleInput = addTraitContainer.querySelector(
            'input[type="checkbox"]',
          ) as HTMLInputElement;
          if (toggleInput) toggleInput.checked = false;

          if (this.spellCountingContainer) {
            this.spellCountingContainer.style.display = "none";
          }

          if (this.spellOptionsContainer) {
            this.spellOptionsContainer.style.display = "none";
          }

          const radioInputs = addTraitContainer.querySelectorAll(
            'input[type="radio"]',
          );
          radioInputs.forEach((input: HTMLInputElement) => {
            if (input.value === "uses") {
              input.checked = true;
            } else {
              input.checked = false;
            }
          });

          this.updateTraitsList(container);
          new Notice(i18n.t("TRAITS.SUCCESS", { name: newTrait.name }));
        }),
    );
  }

  private renderSpellCountingMode() {
    if (!this.spellCountingContainer) return;

    this.spellCountingContainer.empty();

    const title = this.spellCountingContainer.createDiv({
      cls: "spell-counting-title",
    });
    title.setText(i18n.t("TRAITS.SPELL_COUNTING_MODE"));

    const radioContainer = this.spellCountingContainer.createDiv({
      cls: "spell-counting-radio-container",
    });

    const usesOption = radioContainer.createDiv({
      cls: "spell-counting-option",
    });

    const usesRadio = usesOption.createEl("input", {
      type: "radio",
      attr: {
        id: "spell-counting-uses",
        name: "spell-counting-mode",
        value: "uses",
      },
    }) as HTMLInputElement;
    usesRadio.checked = this.spellCountingMode === "uses";
    usesRadio.addEventListener("change", () => {
      if (usesRadio.checked) {
        this.spellCountingMode = "uses";
        this.resetOppositeModeOptions();
        this.renderSpellOptions();
      }
    });

    const usesLabel = usesOption.createEl("label", {
      attr: { for: "spell-counting-uses" },
    });
    usesLabel.setText(i18n.t("TRAITS.SPELL_COUNTING_USES"));

    const slotsOption = radioContainer.createDiv({
      cls: "spell-counting-option",
    });

    const slotsRadio = slotsOption.createEl("input", {
      type: "radio",
      attr: {
        id: "spell-counting-slots",
        name: "spell-counting-mode",
        value: "slots",
      },
    }) as HTMLInputElement;
    slotsRadio.checked = this.spellCountingMode === "slots";
    slotsRadio.addEventListener("change", () => {
      if (slotsRadio.checked) {
        this.spellCountingMode = "slots";
        this.resetOppositeModeOptions();
        this.renderSpellOptions();
      }
    });

    const slotsLabel = slotsOption.createEl("label", {
      attr: { for: "spell-counting-slots" },
    });
    slotsLabel.setText(i18n.t("TRAITS.SPELL_COUNTING_SLOTS"));
  }

  private renderSpellOptions() {
    if (!this.spellOptionsContainer) return;

    this.spellOptionsContainer.empty();
    this.spellOptionsContainer.style.display = "block";

    const options =
      this.spellCountingMode === "uses" ? this.usesOptions : this.slotsOptions;

    options.forEach((option) => {
      const optionContainer = this.spellOptionsContainer!.createDiv({
        cls: "spell-option-row",
      });

      const checkbox = optionContainer.createEl("input", {
        type: "checkbox",
        attr: { id: `spell-option-${option.id}` },
      }) as HTMLInputElement;
      checkbox.checked = option.checked;
      checkbox.addEventListener("change", () => {
        option.checked = checkbox.checked;
        const spellSelect = optionContainer.querySelector(
          ".spell-select-dropdown",
        ) as HTMLSelectElement;
        if (spellSelect) {
          spellSelect.style.display = checkbox.checked ? "block" : "none";
        }
      });

      const label = optionContainer.createEl("label", {
        attr: { for: `spell-option-${option.id}` },
        text: option.label,
      });

      const spellSelect = optionContainer.createEl("select", {
        cls: "spell-select-dropdown",
      }) as HTMLSelectElement;
      spellSelect.style.display = option.checked ? "block" : "none";
      spellSelect.value = option.spell;

      this.populateSpellDropdown(spellSelect);

      spellSelect.addEventListener("change", () => {
        option.spell = spellSelect.value;
      });
    });
  }

  private populateSpellDropdown(select: HTMLSelectElement) {
    const demoSpells = [
      { value: "", text: "Выберите заклинание..." },
      { value: "fireball", text: "Огненный шар" },
      { value: "heal", text: "Лечение" },
      { value: "lightning_bolt", text: "Молниевая стрела" },
      { value: "magic_missile", text: "Волшебная стрела" },
      { value: "cure_wounds", text: "Лечение ран" },
      { value: "shield", text: "Щит" },
      { value: "mage_armor", text: "Доспех мага" },
    ];

    demoSpells.forEach((spell) => {
      const option = select.createEl("option", {
        value: spell.value,
        text: spell.text,
      });
    });
  }

  private resetSpellOptions() {
    this.usesOptions.forEach((option) => {
      option.checked = false;
      option.spell = "";
    });
    this.slotsOptions.forEach((option) => {
      option.checked = false;
      option.spell = "";
    });
  }

  private resetOppositeModeOptions() {
    if (this.spellCountingMode === "uses") {
      this.slotsOptions.forEach((option) => {
        option.checked = false;
        option.spell = "";
      });
    } else {
      this.usesOptions.forEach((option) => {
        option.checked = false;
        option.spell = "";
      });
    }
  }

  private onUsesSpellsChange(value: boolean) {
    this.usesSpells = value;

    if (this.traitNameInput) {
      if (value) {
        const spellTraitName = i18n.t("TRAITS.SPELLS_TRAIT_NAME");
        this.traitNameInput.value = spellTraitName;
        this.newTraitName = spellTraitName;
        this.traitNameInput.readOnly = true;

        if (this.spellCountingContainer) {
          this.spellCountingContainer.style.display = "block";
        }

        this.renderSpellOptions();
      } else {
        this.traitNameInput.value = "";
        this.newTraitName = "";
        this.traitNameInput.readOnly = false;
        this.traitNameInput.placeholder = i18n.t(
          "TRAITS.TRAIT_NAME_PLACEHOLDER",
        );

        if (this.spellCountingContainer) {
          this.spellCountingContainer.style.display = "none";
        }

        if (this.spellOptionsContainer) {
          this.spellOptionsContainer.style.display = "none";
        }

        this.resetSpellOptions();
      }
    }
  }

  private renderTraitsList(container: HTMLElement) {
    const traitsListContainer = container.createDiv({
      cls: "traits-list-container",
    });
    traitsListContainer.createEl("div", {
      text: i18n.t("TRAITS.ADDED_TRAITS"),
      cls: "traits-list-title",
    });

    const traitsListEl = traitsListContainer.createDiv({
      cls: "traits-list",
      attr: { id: "traits-list" },
    });

    this.updateTraitsList(container);
  }

  private updateTraitsList(container: HTMLElement) {
    const traitsListEl = container.querySelector("#traits-list");
    if (!traitsListEl) return;

    traitsListEl.empty();

    if (this.traits.length === 0) {
      traitsListEl.createEl("div", {
        text: i18n.t("TRAITS.NO_TRAITS"),
        cls: "traits-empty",
      });
      return;
    }

    this.traits.forEach((trait, index) => {
      const traitItem = traitsListEl.createDiv({ cls: "trait-item" });

      const traitHeader = traitItem.createDiv({ cls: "trait-header" });
      traitHeader.createEl("strong", { text: trait.name });

      const traitDesc = traitItem.createDiv({ cls: "trait-desc" });
      traitDesc.setText(trait.desc);

      const removeBtn = traitItem.createEl("button", {
        text: i18n.t("COMMON.DELETE"),
        cls: "trait-remove mod-warning",
      });

      removeBtn.addEventListener("click", () => {
        this.traits.splice(index, 1);
        this.updateTraitsList(container);
        new Notice(i18n.t("TRAITS.DELETE_SUCCESS", { name: trait.name }));
      });
    });
  }

  getTraits(): CreatureTrait[] {
    return this.traits;
  }

  getUsesSpells(): boolean {
    return this.usesSpells;
  }

  getSpellCountingMode(): string {
    return this.spellCountingMode;
  }

  getSelectedSpellOptions(): any[] {
    if (this.spellCountingMode === "uses") {
      return this.usesOptions.filter((option) => option.checked);
    } else {
      return this.slotsOptions.filter((option) => option.checked);
    }
  }
}