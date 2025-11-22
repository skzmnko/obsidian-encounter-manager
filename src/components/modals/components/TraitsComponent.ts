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

    // Контейнер для выбора режима счета заклинаний внутри блока черты
    this.spellCountingContainer = addTraitContainer.createDiv({
      cls: "spell-counting-container",
    });
    this.spellCountingContainer.style.display = "none";

    this.renderSpellCountingMode();

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

          // Сбрасываем форму
          this.newTraitName = "";
          this.newTraitDesc = "";
          this.usesSpells = false;
          this.spellCountingMode = "uses";

          if (this.traitNameInput) {
            this.traitNameInput.value = "";
            this.traitNameInput.readOnly = false;
            this.traitNameInput.placeholder = i18n.t("TRAITS.TRAIT_NAME_PLACEHOLDER");
          }

          const descInput = addTraitContainer.querySelector(
            "textarea",
          ) as HTMLTextAreaElement;
          if (descInput) descInput.value = "";

          // Сбрасываем чекбокс и скрываем контейнер выбора режима
          const toggleInput = addTraitContainer.querySelector(
            'input[type="checkbox"]',
          ) as HTMLInputElement;
          if (toggleInput) toggleInput.checked = false;

          if (this.spellCountingContainer) {
            this.spellCountingContainer.style.display = "none";
          }

          // Сбрасываем радиокнопки
          const radioInputs = addTraitContainer.querySelectorAll('input[type="radio"]');
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

    // Заголовок
    const title = this.spellCountingContainer.createDiv({
      cls: "spell-counting-title",
    });
    title.setText(i18n.t("TRAITS.SPELL_COUNTING_MODE"));

    // Контейнер для радиокнопок
    const radioContainer = this.spellCountingContainer.createDiv({
      cls: "spell-counting-radio-container",
    });

    // Опция "Количество использований"
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
      }
    });

    const usesLabel = usesOption.createEl("label", {
      attr: { for: "spell-counting-uses" },
    });
    usesLabel.setText(i18n.t("TRAITS.SPELL_COUNTING_USES"));

    // Опция "Слоты"
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
      }
    });

    const slotsLabel = slotsOption.createEl("label", {
      attr: { for: "spell-counting-slots" },
    });
    slotsLabel.setText(i18n.t("TRAITS.SPELL_COUNTING_SLOTS"));
  }

  private onUsesSpellsChange(value: boolean) {
    this.usesSpells = value;

    if (this.traitNameInput) {
      if (value) {
        // Включаем чекбокс - заполняем название и делаем read-only
        const spellTraitName = i18n.t("TRAITS.SPELLS_TRAIT_NAME");
        this.traitNameInput.value = spellTraitName;
        this.newTraitName = spellTraitName;
        this.traitNameInput.readOnly = true;

        // Показываем контейнер выбора режима счета заклинаний
        if (this.spellCountingContainer) {
          this.spellCountingContainer.style.display = "block";
        }
      } else {
        // Выключаем чекбокс - очищаем поле и снимаем read-only
        this.traitNameInput.value = "";
        this.newTraitName = "";
        this.traitNameInput.readOnly = false;
        this.traitNameInput.placeholder = i18n.t("TRAITS.TRAIT_NAME_PLACEHOLDER");

        // Скрываем контейнер выбора режима счета заклинаний
        if (this.spellCountingContainer) {
          this.spellCountingContainer.style.display = "none";
        }
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
}