import { Spell, SpellsData } from "src/models/Spells";
import { StorageService } from "src/services/StorageService";

export class SpellService {
  private storage: StorageService;
  private spells: Spell[] = [];
  private isInitialized: boolean = false;

  constructor(plugin: any) {
    this.storage = new StorageService(plugin);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    await this.loadSpells();
    this.isInitialized = true;
    console.log("SpellService initialized with", this.spells.length, "spells");
  }

  async createSpell(
    spellData: Omit<Spell, "id" | "created" | "updated">,
  ): Promise<Spell> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const components = {
      verbal: spellData.components?.verbal || false,
      verbalDescription: spellData.components?.verbalDescription || "",
      somatic: spellData.components?.somatic || false,
      material: spellData.components?.material || false,
      materialDescription: spellData.components?.materialDescription || "",
    };

    const spell: Spell = {
      name: spellData.name,
      level: spellData.level,
      school: spellData.school,
      classes: spellData.classes,
      actionType: spellData.actionType,
      castingTrigger: spellData.castingTrigger || "",
      castingTime: spellData.castingTime,
      range: spellData.range,
      duration: spellData.duration,
      concentration: spellData.concentration,
      ritual: spellData.ritual,
      components: components,
      description: spellData.description,
      spellUpgrade: spellData.spellUpgrade || "",
      summonCreature: spellData.summonCreature,
      summonedCreatures: spellData.summonedCreatures,
      manaCost: spellData.manaCost || false,
      id: this.generateId(),
      created: Date.now(),
      updated: Date.now(),
    };

    console.log("Creating new spell:", spell.name);

    this.spells.push(spell);

    try {
      await this.saveSpells();
      console.log(
        "Spell created successfully, total spells:",
        this.spells.length,
      );
      return spell;
    } catch (error) {
      this.spells.pop();
      console.error("Failed to save spell, rolling back:", error);
      throw error;
    }
  }

  async getSpell(id: string): Promise<Spell | undefined> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.spells.find((spell) => spell.id === id);
  }

  async updateSpell(
    id: string,
    updates: Partial<Spell>,
  ): Promise<Spell | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const index = this.spells.findIndex((spell) => spell.id === id);
    if (index === -1) return null;

    const originalSpell = { ...this.spells[index] };

    if (updates.components) {
      updates.components = {
        verbal: updates.components.verbal ?? originalSpell.components.verbal,
        verbalDescription: updates.components.verbalDescription ?? originalSpell.components.verbalDescription ?? "",
        somatic: updates.components.somatic ?? originalSpell.components.somatic,
        material: updates.components.material ?? originalSpell.components.material,
        materialDescription: updates.components.materialDescription ?? originalSpell.components.materialDescription ?? "",
      };
    }

    this.spells[index] = {
      ...this.spells[index],
      ...updates,
      updated: Date.now(),
    };

    try {
      await this.saveSpells();
      return this.spells[index];
    } catch (error) {
      this.spells[index] = originalSpell;
      console.error("Failed to update spell, rolling back:", error);
      throw error;
    }
  }

  async deleteSpell(id: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const index = this.spells.findIndex((spell) => spell.id === id);
    if (index === -1) return false;

    const [deletedSpell] = this.spells.splice(index, 1);

    try {
      await this.saveSpells();
      return true;
    } catch (error) {
      this.spells.splice(index, 0, deletedSpell);
      console.error("Failed to delete spell, rolling back:", error);
      throw error;
    }
  }

  getAllSpells(): Spell[] {
    return [...this.spells];
  }

  getSpellsByLevel(level: number): Spell[] {
    return this.spells.filter((spell) => spell.level === level);
  }

  getSpellsBySchool(school: string): Spell[] {
    return this.spells.filter((spell) => spell.school === school);
  }

  getSpellsByClass(className: string): Spell[] {
    return this.spells.filter((spell) => spell.classes.includes(className));
  }

  private async loadSpells(): Promise<void> {
    try {
      console.log("Loading spells from storage...");
      const data = await this.storage.loadSpellsData();
      this.spells = data?.spells || [];
      this.spells = this.spells.map(spell => this.normalizeSpellStructure(spell));
      
      console.log("Spells loaded successfully:", this.spells.length);
    } catch (error) {
      console.error("Error loading spells:", error);
      this.spells = [];
    }
  }

  private async saveSpells(): Promise<void> {
    try {
      console.log("Saving spells to storage, count:", this.spells.length);

      const normalizedSpells = this.spells.map(spell => this.normalizeSpellStructure(spell));

      const data: SpellsData = {
        spells: normalizedSpells,
        lastUpdated: Date.now(),
      };

      await this.storage.saveSpellsData(data);
      console.log("Spells saved successfully");
    } catch (error) {
      console.error("Error saving spells:", error);
      throw new Error(`Failed to save spells: ${error.message}`);
    }
  }

  private normalizeSpellStructure(spell: Spell): Spell {
    return {
      name: spell.name,
      level: spell.level,
      school: spell.school,
      classes: spell.classes,
      actionType: spell.actionType,
      castingTrigger: spell.castingTrigger || "",
      castingTime: spell.castingTime,
      range: spell.range,
      duration: spell.duration,
      concentration: spell.concentration,
      ritual: spell.ritual,
      components: {
        verbal: spell.components?.verbal || false,
        verbalDescription: spell.components?.verbalDescription || "",
        somatic: spell.components?.somatic || false,
        material: spell.components?.material || false,
        materialDescription: spell.components?.materialDescription || "",
      },
      description: spell.description,
      spellUpgrade: spell.spellUpgrade || "",
      summonCreature: spell.summonCreature,
      summonedCreatures: spell.summonedCreatures || [],
      manaCost: spell.manaCost || false,
      id: spell.id,
      created: spell.created,
      updated: spell.updated,
    };
  }

  generateId(): string {
    return (
      "spell_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }
}