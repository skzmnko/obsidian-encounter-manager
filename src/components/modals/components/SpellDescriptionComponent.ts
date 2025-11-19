import { Setting, TextAreaComponent } from "obsidian";
import { Spell } from "src/models/Spells";
import { i18n } from "src/services/LocalizationService";

export class SpellDescriptionComponent {
  private spellData: Partial<Spell>;

  constructor(spellData: Partial<Spell>) {
    this.spellData = spellData;
  }

  render(container: HTMLElement) {
    const section = container.createDiv({ cls: "creature-section" });

    section.createEl("h3", {
      text: i18n.t("SPELL_FIELDS.DESCRIPTION"),
      cls: "section-title",
    });

    const descriptionContainer = section.createDiv("description-section");

    new Setting(descriptionContainer)
      .setName(i18n.t("SPELL_FIELDS.MANA_COST"))
      .setDesc(i18n.t("SPELL_FIELDS.MANA_COST_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.manaCost || false)
          .onChange((value) => (this.spellData.manaCost = value)),
      );

    const descSetting = new Setting(descriptionContainer)
      .setName(i18n.t("SPELL_FIELDS.DESCRIPTION"))
      .setDesc(i18n.t("SPELL_FIELDS.DESCRIPTION_DESC"));

    const textArea = new TextAreaComponent(descSetting.controlEl);
    textArea
      .setPlaceholder(i18n.t("SPELL_FIELDS.DESCRIPTION_PLACEHOLDER"))
      .setValue(this.spellData.description || "")
      .onChange((value) => (this.spellData.description = value));
    textArea.inputEl.style.width = "100%";
    textArea.inputEl.rows = 6;
    textArea.inputEl.addClass("spell-textarea");

    const upgradeSetting = new Setting(descriptionContainer)
      .setName(i18n.t("SPELL_FIELDS.CANTRIP_UPGRADE"))
      .setDesc(i18n.t("SPELL_FIELDS.CANTRIP_UPGRADE_DESC"));

    const upgradeTextArea = new TextAreaComponent(upgradeSetting.controlEl);
    upgradeTextArea
      .setPlaceholder(i18n.t("SPELL_FIELDS.CANTRIP_UPGRADE_PLACEHOLDER"))
      .setValue(this.spellData.cantripUpgrade || "")
      .onChange((value) => (this.spellData.cantripUpgrade = value));
    upgradeTextArea.inputEl.style.width = "100%";
    upgradeTextArea.inputEl.rows = 3;
    upgradeTextArea.inputEl.addClass("cantrip-upgrade-textarea");
  }
}
