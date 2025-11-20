import { App, Modal, Setting, Notice } from "obsidian";
import { Spell } from "src/models/Spells";
import { i18n } from "src/services/LocalizationService";
import { SpellModalStyles } from "./SpellModalStyles";
import { SpellBasicFieldsComponent } from "./components/SpellBasicFieldsComponent";
import { SpellComponentsComponent } from "./components/SpellComponentsComponent";
import { SpellDescriptionComponent } from "./components/SpellDescriptionComponent";
import {
  SpellSchoolKey,
  SpellClassKey,
  ActionTypeKey,
} from "src/constants/game_data_i18n";

export class SpellCreationModal extends Modal {
  private spellData: Partial<Spell> = {
    name: "",
    level: 0,
    school: "",
    classes: [],
    actionType: "ACTION",
    castingTrigger: "",
    concentration: false,
    ritual: false,
    castingTime: "",
    range: "",
    duration: "",
    components: {
      verbal: false,
      verbalDescription: "",
      somatic: false,
      material: false,
      materialDescription: "",
    },
    description: "",
    spellUpgrade: "",
    summonCreature: false,
    summonedCreatures: [],
    manaCost: false,
  };

  private basicFields: SpellBasicFieldsComponent;
  private components: SpellComponentsComponent;
  private description: SpellDescriptionComponent;

  constructor(
    app: App,
    private spellService: any,
    private onSave: (spell: Spell) => void,
    private bestiaryService?: any,
  ) {
    super(app);

    this.basicFields = new SpellBasicFieldsComponent(this.spellData);
    this.components = new SpellComponentsComponent(this.spellData);
    this.description = new SpellDescriptionComponent(
      this.spellData,
      this.bestiaryService,
    );
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("spell-modal-container");

    this.modalEl.addClass("mod-spell-creation");
    this.applyStyles(contentEl);

    contentEl.createEl("h2", { text: i18n.t("SPELL_MODAL.TITLE") });

    this.renderComponents(contentEl);
    this.renderSaveButtons(contentEl);
  }

  private applyStyles(contentEl: HTMLElement) {
    const style = contentEl.createEl("style");
    style.textContent = SpellModalStyles;
  }

  private renderComponents(contentEl: HTMLElement) {
    this.basicFields.render(contentEl);
    this.components.render(contentEl);
    this.description.render(contentEl);
  }

  private renderSaveButtons(contentEl: HTMLElement) {
    const buttonContainer = contentEl.createDiv({
      cls: "spell-button-container",
    });

    new Setting(buttonContainer)
      .addButton((btn) =>
        btn
          .setButtonText(i18n.t("SPELL_MODAL.SAVE_BUTTON"))
          .setCta()
          .onClick(() => this.saveSpell()),
      )
      .addButton((btn) =>
        btn
          .setButtonText(i18n.t("SPELL_MODAL.CANCEL_BUTTON"))
          .onClick(() => this.close()),
      );
  }

  private async saveSpell() {
    if (!this.spellData.name?.trim()) {
      new Notice(i18n.t("SPELL_MODAL.VALIDATION_NAME"));
      return;
    }

    if (this.spellData.level === undefined) {
      new Notice(i18n.t("SPELL_MODAL.VALIDATION_LEVEL"));
      return;
    }

    if (!this.spellData.school) {
      new Notice(i18n.t("SPELL_MODAL.VALIDATION_SCHOOL"));
      return;
    }

    if (!this.spellData.classes || this.spellData.classes.length === 0) {
      new Notice(i18n.t("SPELL_MODAL.VALIDATION_CLASSES"));
      return;
    }

    const spellData = {
      name: this.spellData.name,
      level: this.spellData.level,
      school: i18n.getGameData(
        "SPELL_SCHOOLS",
        this.spellData.school as SpellSchoolKey,
      ),
      classes: this.spellData.classes.map((cls) =>
        i18n.getGameData("SPELL_CLASSES", cls as SpellClassKey),
      ),
      actionType: i18n.getGameData(
        "ACTION_TYPES",
        this.spellData.actionType as ActionTypeKey,
      ),
      castingTrigger: this.spellData.castingTrigger || "",
      castingTime: this.spellData.castingTime || "",
      range: this.spellData.range || "",
      duration: this.spellData.duration || "",
      concentration: this.spellData.concentration || false,
      ritual: this.spellData.ritual || false,
      components: {
        verbal: this.spellData.components?.verbal || false,
        verbalDescription: this.spellData.components?.verbalDescription || "",
        somatic: this.spellData.components?.somatic || false,
        material: this.spellData.components?.material || false,
        materialDescription:
          this.spellData.components?.materialDescription || "",
      },
      description: this.spellData.description || "",
      spellUpgrade: this.spellData.spellUpgrade || "",
      summonCreature: this.spellData.summonCreature || false,
      summonedCreatures: this.spellData.summonedCreatures || [],
      manaCost: this.spellData.manaCost || false,
    };

    try {
      const spell = await this.spellService.createSpell(spellData);
      this.onSave(spell);
      this.close();
      new Notice(i18n.t("SPELL_MODAL.SUCCESS", { name: spell.name }));
    } catch (error: any) {
      console.error("Error creating spell:", error);
      new Notice(i18n.t("SPELL_MODAL.ERROR", { message: error.message }));
    }
  }
}
