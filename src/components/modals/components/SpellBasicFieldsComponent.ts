import { Setting } from "obsidian";
import { Spell } from "src/models/Spells";
import { i18n } from "src/services/LocalizationService";
import {
  SpellSchoolKey,
  SpellClassKey,
  ActionTypeKey,
} from "src/constants/game_data_i18n";

export class SpellBasicFieldsComponent {
  private spellData: Partial<Spell>;
  private selectedClassesContainer: HTMLElement | null = null;

  constructor(spellData: Partial<Spell>) {
    this.spellData = spellData;
  }

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });

    section.createEl("h3", {
      text: i18n.t("SPELL_FIELDS.TITLE"),
      cls: "section-title",
    });

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.NAME"))
      .setDesc(i18n.t("SPELL_FIELDS.NAME_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("SPELL_FIELDS.NAME_PLACEHOLDER"))
          .setValue(this.spellData.name || "")
          .onChange((value) => (this.spellData.name = value)),
      );

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.LEVEL"))
      .setDesc(i18n.t("SPELL_FIELDS.LEVEL_DESC"))
      .addDropdown((dropdown) => {
        dropdown.addOption("0", "0 (Cantrip)");
        for (let i = 1; i <= 9; i++) {
          dropdown.addOption(i.toString(), `${i} (Level ${i})`);
        }
        dropdown
          .setValue(this.spellData.level?.toString() || "0")
          .onChange((value) => (this.spellData.level = parseInt(value)));
      });

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.SCHOOL"))
      .setDesc(i18n.t("SPELL_FIELDS.SCHOOL_DESC"))
      .addDropdown((dropdown) => {
        const schools = i18n.getGameDataCategory("SPELL_SCHOOLS");
        dropdown.addOption(
          "",
          i18n.t("SPELL_FIELDS.SELECT_DAMAGE") || "Select school...",
        );
        Object.entries(schools).forEach(([key, value]) => {
          dropdown.addOption(key, value);
        });
        dropdown
          .setValue(this.spellData.school || "")
          .onChange((value) => (this.spellData.school = value));
      });

    const classesSetting = new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.CLASSES"))
      .setDesc(i18n.t("SPELL_FIELDS.CLASSES_DESC"))
      .addDropdown((dropdown) => {
        const classes = i18n.getGameDataCategory("SPELL_CLASSES");
        dropdown.addOption("", "Select class...");
        Object.entries(classes).forEach(([key, value]) => {
          dropdown.addOption(key, value);
        });
        dropdown.setValue("").onChange((value) => {
          if (value && !this.spellData.classes?.includes(value)) {
            this.spellData.classes = [...(this.spellData.classes || []), value];
            this.updateSelectedClassesDisplay();
          }
          dropdown.setValue("");
        });
      });

    this.selectedClassesContainer = section.createDiv(
      "selected-classes-container",
    );
    this.updateSelectedClassesDisplay();

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.ACTION_TYPE"))
      .setDesc(i18n.t("SPELL_FIELDS.ACTION_TYPE_DESC"))
      .addDropdown((dropdown) => {
        const actionTypes = i18n.getGameDataCategory("ACTION_TYPES");
        Object.entries(actionTypes).forEach(([key, value]) => {
          dropdown.addOption(key, value);
        });
        dropdown
          .setValue(this.spellData.actionType || "ACTION")
          .onChange(
            (value) => (this.spellData.actionType = value as ActionTypeKey),
          );
      });

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.CONCENTRATION"))
      .setDesc(i18n.t("SPELL_FIELDS.CONCENTRATION_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.concentration || false)
          .onChange((value) => (this.spellData.concentration = value)),
      );

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.RITUAL"))
      .setDesc(i18n.t("SPELL_FIELDS.RITUAL_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.ritual || false)
          .onChange((value) => (this.spellData.ritual = value)),
      );

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.CASTING_TIME"))
      .setDesc(i18n.t("SPELL_FIELDS.CASTING_TIME_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("SPELL_FIELDS.CASTING_TIME_PLACEHOLDER"))
          .setValue(this.spellData.castingTime || "")
          .onChange((value) => (this.spellData.castingTime = value)),
      );

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.RANGE"))
      .setDesc(i18n.t("SPELL_FIELDS.RANGE_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("SPELL_FIELDS.RANGE_PLACEHOLDER"))
          .setValue(this.spellData.range || "")
          .onChange((value) => (this.spellData.range = value)),
      );

    new Setting(section)
      .setName(i18n.t("SPELL_FIELDS.DURATION"))
      .setDesc(i18n.t("SPELL_FIELDS.DURATION_DESC"))
      .addText((text) =>
        text
          .setPlaceholder(i18n.t("SPELL_FIELDS.DURATION_PLACEHOLDER"))
          .setValue(this.spellData.duration || "")
          .onChange((value) => (this.spellData.duration = value)),
      );
  }

  private updateSelectedClassesDisplay() {
    if (!this.selectedClassesContainer) return;

    this.selectedClassesContainer.empty();

    if (!this.spellData.classes || this.spellData.classes.length === 0) {
      const emptyText = this.selectedClassesContainer.createDiv(
        "selected-values-empty",
      );
      emptyText.setText(
        i18n.t("IMMUNITIES.NOT_SELECTED") || "No classes selected",
      );
      return;
    }

    this.selectedClassesContainer.createEl("div", {
      text: i18n.t("SPELL_FIELDS.CLASSES") + ":",
      cls: "selected-values-title",
    });

    const classesList = this.selectedClassesContainer.createDiv(
      "selected-values-list",
    );
    this.spellData.classes.forEach((className) => {
      const classItem = classesList.createDiv("selected-value-item");
      classItem.setText(
        i18n.getGameData("SPELL_CLASSES", className as SpellClassKey),
      );

      const removeBtn = classItem.createEl("button", {
        text: "×",
        cls: "selected-value-remove",
      });
      removeBtn.addEventListener("click", () => {
        this.spellData.classes = this.spellData.classes?.filter(
          (c) => c !== className,
        );
        this.updateSelectedClassesDisplay();
      });
    });
  }
}
