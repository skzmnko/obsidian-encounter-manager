import { App, Modal, Setting, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { CREATURE_SIZES, ALIGNMENTS } from 'src/constants/Constants';
import { CreatureModalStyles } from 'src/components/modals/CreatureModalStyles';
import { BasicFieldsComponent } from 'src/components/modals/components/BasicFieldsComponent';
import { AbilityScoresComponent } from 'src/components/modals/components/AbilityScoresComponent';
import { ImmunitiesComponent } from 'src/components/modals/components/ImmunitiesComponent';
import { TraitsComponent } from 'src/components/modals/components/TraitsComponent';
import { ActionsComponent } from 'src/components/modals/components/ActionsComponent';
import { AdditionalFieldsComponent } from 'src/components/modals/components/AdditionalFieldsComponent';

export class CreatureCreationModal extends Modal {
    private basicFields: BasicFieldsComponent;
    private abilityScores: AbilityScoresComponent;
    private immunities: ImmunitiesComponent;
    private traits: TraitsComponent;
    private actions: ActionsComponent;
    private additionalFields: AdditionalFieldsComponent;

    constructor(
        app: App, 
        private bestiaryService: any, 
        private onSave: (creature: Creature) => void
    ) {
        super(app);
        
        this.basicFields = new BasicFieldsComponent();
        this.abilityScores = new AbilityScoresComponent();
        this.immunities = new ImmunitiesComponent();
        this.traits = new TraitsComponent();
        this.actions = new ActionsComponent();
        this.additionalFields = new AdditionalFieldsComponent();
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Добавить существо в бестиарий' });

        this.applyStyles(contentEl);
        this.renderComponents(contentEl);
        this.renderSaveButtons(contentEl);
        this.setupComponentConnections();
    }

    private applyStyles(contentEl: HTMLElement) {
        const style = contentEl.createEl('style');
        style.textContent = CreatureModalStyles;
    }

    private setupComponentConnections() {
        this.basicFields.onProficiencyBonusChange((bonus: number) => {
            this.abilityScores.setProficiencyBonus(bonus);
        });

        this.abilityScores.onAbilityChange(() => {
            this.abilityScores.updateInitiative();
        });
    }

    private renderComponents(contentEl: HTMLElement) {
        // Основные поля
        this.basicFields.render(contentEl);

        // Характеристики и спасброски
        this.abilityScores.render(contentEl);

        // Иммунитеты и сопротивления
        this.immunities.render(contentEl);

        // Дополнительные поля
        this.additionalFields.render(contentEl);

        // Черты
        this.traits.render(contentEl);

        // Действия
        this.actions.render(contentEl);
    }

    private renderSaveButtons(contentEl: HTMLElement) {
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Сохранить')
                .setCta()
                .onClick(() => this.saveCreature()))
            .addButton(btn => btn
                .setButtonText('Отмена')
                .onClick(() => this.close()));
    }

    private async saveCreature() {
        if (!this.basicFields.getName().trim()) {
            new Notice('Пожалуйста, введите имя существа');
            return;
        }

        const creatureData = {
            name: this.basicFields.getName(),
            type: this.basicFields.getType(),
            size: this.basicFields.getSize(),
            alignment: this.basicFields.getAlignment(),
            ac: this.basicFields.getAC(),
            hit_dice: this.basicFields.getHitDice(),
            speed: this.basicFields.getSpeed(),
            initiative: this.abilityScores.getInitiative(),
            proficiency_bonus: this.basicFields.getProficiencyBonus(),
            characteristics: this.abilityScores.getCharacteristics(),
            saving_throws: this.abilityScores.calculateSavingThrows(),
            skills: this.additionalFields.getSkills(),
            damage_resistances: this.immunities.getDamageResistances(),
            damage_vulnerabilities: this.immunities.getDamageVulnerabilities(),
            damage_immunities: this.immunities.getDamageImmunities(),
            condition_immunities: this.immunities.getConditionImmunities(),
            senses: this.additionalFields.getSenses(),
            languages: this.additionalFields.getLanguages(),
            habitat: this.basicFields.getHabitat(),
            traits: this.traits.getTraits(),
            actions: this.actions.getActions(),
            legendaryActions: this.additionalFields.getLegendaryActions(),
            notes: this.additionalFields.getNotes()
        };

        try {
            const creature = await this.bestiaryService.createCreature(creatureData);
            this.onSave(creature);
            this.close();
            new Notice(`Существо "${creature.name}" добавлено в бестиарий!`);
        } catch (error) {
            console.error('Error creating creature:', error);
            new Notice('Ошибка при сохранении существа: ' + error.message);
        }
    }
}