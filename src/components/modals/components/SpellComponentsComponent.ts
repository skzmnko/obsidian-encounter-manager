import { Setting } from "obsidian";
import { Spell } from "src/models/Spells";
import { i18n } from "src/services/LocalizationService";

export class SpellComponentsComponent {
  private spellData: Partial<Spell>;
  private container: HTMLElement | null = null;

  constructor(spellData: Partial<Spell>) {
    this.spellData = spellData;
  }

  render(container: HTMLElement) {
    this.container = container;

    const section = container.createDiv({ cls: "creature-section" });

    section.createEl("h3", {
      text: i18n.t("SPELL_FIELDS.COMPONENTS"),
      cls: "section-title",
    });

    const componentsContainer = section.createDiv("components-section");

    new Setting(componentsContainer)
      .setName(i18n.t("SPELL_FIELDS.VERBAL"))
      .setDesc(i18n.t("SPELL_FIELDS.VERBAL_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.components?.verbal || false)
          .onChange((value) => {
            if (!this.spellData.components)
              this.spellData.components = {
                verbal: false,
                somatic: false,
                material: false,
              };
            this.spellData.components.verbal = value;
          }),
      );

    new Setting(componentsContainer)
      .setName(i18n.t("SPELL_FIELDS.SOMATIC"))
      .setDesc(i18n.t("SPELL_FIELDS.SOMATIC_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.components?.somatic || false)
          .onChange((value) => {
            if (!this.spellData.components)
              this.spellData.components = {
                verbal: false,
                somatic: false,
                material: false,
              };
            this.spellData.components.somatic = value;
          }),
      );

    new Setting(componentsContainer)
      .setName(i18n.t("SPELL_FIELDS.MATERIAL"))
      .setDesc(i18n.t("SPELL_FIELDS.MATERIAL_DESC"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.spellData.components?.material || false)
          .onChange((value) => {
            if (!this.spellData.components)
              this.spellData.components = {
                verbal: false,
                somatic: false,
                material: false,
              };
            this.spellData.components.material = value;
            this.renderMaterialDescription(componentsContainer);
          }),
      );

    this.renderMaterialDescription(componentsContainer);
  }

  private renderMaterialDescription(container: HTMLElement) {
    const existingDesc = container.querySelector(
      ".material-description-container",
    );
    if (existingDesc) {
      existingDesc.remove();
    }

    if (this.spellData.components?.material) {
      const materialDescContainer = container.createDiv(
        "material-description-container",
      );
      new Setting(materialDescContainer)
        .setName(i18n.t("SPELL_FIELDS.MATERIAL_DESCRIPTION"))
        .setDesc(i18n.t("SPELL_FIELDS.MATERIAL_DESCRIPTION_DESC"))
        .addTextArea((textarea) => {
          textarea
            .setPlaceholder(
              i18n.t("SPELL_FIELDS.MATERIAL_DESCRIPTION_PLACEHOLDER"),
            )
            .setValue(this.spellData.components?.materialDescription || "")
            .onChange((value) => {
              if (this.spellData.components) {
                this.spellData.components.materialDescription = value;
              }
            });
          textarea.inputEl.rows = 3;
          textarea.inputEl.addClass("spell-textarea");
        });
    }
  }
}
