import { App, Modal, Setting, Notice } from 'obsidian';
import { Creature } from 'src/models/Bestiary';
import { CreatureModalStyles } from './CreatureModalStyles';
import { BasicFieldsComponent } from './components/BasicFieldsComponent';
import { CoreParametersComponent } from './components/CoreParametersComponent';
import { AbilityScoresComponent } from './components/AbilityScoresComponent';
import { AdditionalFieldsComponent } from './components/AdditionalFieldsComponent';
import { ImmunitiesComponent } from './components/ImmunitiesComponent';
import { TraitsComponent } from './components/TraitsComponent';
import { ActionsComponent } from './components/ActionsComponent';
import { BonusActionsComponent } from './components/BonusActionsComponent';
import { ReactionsComponent } from './components/ReactionsComponent';
import { LegendaryActionsComponent } from './components/LegendaryActionsComponent';
import { i18n } from 'src/services/LocalizationService';
import { CreatureTypeKey, SizeKey, AlignmentKey, DamageTypeKey, ConditionKey } from 'src/constants/game_data_i18n';

export class CreatureCreationModal extends Modal {
    private basicFields: BasicFieldsComponent;
    private coreParameters: CoreParametersComponent;
    private abilityScores: AbilityScoresComponent;
    private additionalFields: AdditionalFieldsComponent;
    private immunities: ImmunitiesComponent;
    private traits: TraitsComponent;
    private actions: ActionsComponent;
    private bonusActions: BonusActionsComponent;
    private reactions: ReactionsComponent;
    private legendaryActions: LegendaryActionsComponent;

    constructor(
        app: App, 
        private bestiaryService: any, 
        private onSave: (creature: Creature) => void
    ) {
        super(app);
        
        this.basicFields = new BasicFieldsComponent();
        this.coreParameters = new CoreParametersComponent();
        this.abilityScores = new AbilityScoresComponent();
        this.additionalFields = new AdditionalFieldsComponent();
        this.immunities = new ImmunitiesComponent();
        this.traits = new TraitsComponent();
        this.actions = new ActionsComponent();
        this.bonusActions = new BonusActionsComponent();
        this.reactions = new ReactionsComponent();
        this.legendaryActions = new LegendaryActionsComponent();
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: i18n.t('CREATURE_MODAL.TITLE') });

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
        this.coreParameters.onProficiencyBonusChange((bonus: number) => {
            this.abilityScores.setProficiencyBonus(bonus);
        });

        this.abilityScores.onAbilityChange(() => {
            this.coreParameters.updateInitiative(this.abilityScores.getInitiative());
        });
    }

    private renderComponents(contentEl: HTMLElement) {

        this.basicFields.render(contentEl);
        this.coreParameters.render(contentEl);
        this.abilityScores.render(contentEl);
        this.additionalFields.render(contentEl);
        this.immunities.render(contentEl);
        this.traits.render(contentEl);
        this.actions.render(contentEl);
        this.bonusActions.render(contentEl);
        this.reactions.render(contentEl);
        this.legendaryActions.render(contentEl);
    }

    private renderSaveButtons(contentEl: HTMLElement) {
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText(i18n.t('CREATURE_MODAL.SAVE_BUTTON'))
                .setCta()
                .onClick(() => this.saveCreature()))
            .addButton(btn => btn
                .setButtonText(i18n.t('CREATURE_MODAL.CANCEL_BUTTON'))
                .onClick(() => this.close()));
    }

    private async saveCreature() {
        if (!this.basicFields.getName().trim()) {
            new Notice(i18n.t('CREATURE_MODAL.VALIDATION_NAME'));
            return;
        }

        const creatureData = {
            name: this.basicFields.getName(),
            type: i18n.getCreatureType(this.basicFields.getType() as CreatureTypeKey),
            size: i18n.getSize(this.basicFields.getSize() as SizeKey),
            alignment: i18n.getAlignment(this.basicFields.getAlignment() as AlignmentKey),
            habitat: this.basicFields.getHabitat(),
            languages: this.basicFields.getLanguages(),
            ac: this.coreParameters.getAC(),
            hit_dice: this.coreParameters.getHitDice(),
            speed: this.coreParameters.getSpeed(),
            proficiency_bonus: this.coreParameters.getProficiencyBonus(),
            initiative: this.abilityScores.getInitiative(),
            characteristics: this.abilityScores.getCharacteristics(),
            saving_throws: this.abilityScores.calculateSavingThrows(),
            skills: this.additionalFields.getSkills(),
            senses: this.additionalFields.getSenses(),
            damage_resistances: this.immunities.getDamageResistances().map(res => i18n.getDamageType(res as any)),
            damage_vulnerabilities: this.immunities.getDamageVulnerabilities().map(vul => i18n.getDamageType(vul as any)),
            damage_immunities: this.immunities.getDamageImmunities().map(imm => i18n.getDamageType(imm as any)),
            condition_immunities: this.immunities.getConditionImmunities().map(cond => i18n.getCondition(cond as any)),
            traits: this.traits.getTraits(),
            actions: this.actions.getActions(),
            bonus_actions: this.bonusActions.getBonusActions(),
            reactions: this.reactions.getReactions(),
            legendary_actions: this.legendaryActions.getLegendaryActions(),
            notes: this.additionalFields.getNotes()
        };

        try {
            const creature = await this.bestiaryService.createCreature(creatureData);
            this.onSave(creature);
            this.close();
            new Notice(i18n.t('CREATURE_MODAL.SUCCESS', { name: creature.name }));
        } catch (error) {
            console.error('Error creating creature:', error);
            new Notice(i18n.t('CREATURE_MODAL.ERROR', { message: error.message }));
        }
    }
}