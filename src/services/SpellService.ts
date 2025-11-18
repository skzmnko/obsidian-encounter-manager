import { Spell, SpellsData } from 'src/models/Spells';
import { StorageService } from 'src/services/StorageService';

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
        console.log('SpellService initialized with', this.spells.length, 'spells');
    }

    async createSpell(spellData: Omit<Spell, 'id' | 'created' | 'updated'>): Promise<Spell> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const spell: Spell = {
            ...spellData,
            id: this.generateId(),
            created: Date.now(),
            updated: Date.now()
        };

        console.log('Creating new spell:', spell.name);
        
        this.spells.push(spell);
        
        try {
            await this.saveSpells();
            console.log('Spell created successfully, total spells:', this.spells.length);
            return spell;
        } catch (error) {
            this.spells.pop();
            console.error('Failed to save spell, rolling back:', error);
            throw error;
        }
    }

    async getSpell(id: string): Promise<Spell | undefined> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.spells.find(spell => spell.id === id);
    }

    async updateSpell(id: string, updates: Partial<Spell>): Promise<Spell | null> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const index = this.spells.findIndex(spell => spell.id === id);
        if (index === -1) return null;

        const originalSpell = { ...this.spells[index] };
        
        this.spells[index] = {
            ...this.spells[index],
            ...updates,
            updated: Date.now()
        };

        try {
            await this.saveSpells();
            return this.spells[index];
        } catch (error) {
            this.spells[index] = originalSpell;
            console.error('Failed to update spell, rolling back:', error);
            throw error;
        }
    }

    async deleteSpell(id: string): Promise<boolean> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const index = this.spells.findIndex(spell => spell.id === id);
        if (index === -1) return false;

        const [deletedSpell] = this.spells.splice(index, 1);
        
        try {
            await this.saveSpells();
            return true;
        } catch (error) {
            this.spells.splice(index, 0, deletedSpell);
            console.error('Failed to delete spell, rolling back:', error);
            throw error;
        }
    }

    getAllSpells(): Spell[] {
        return [...this.spells];
    }

    getSpellsByLevel(level: number): Spell[] {
        return this.spells.filter(spell => spell.level === level);
    }

    getSpellsBySchool(school: string): Spell[] {
        return this.spells.filter(spell => spell.school === school);
    }

    getSpellsByClass(className: string): Spell[] {
        return this.spells.filter(spell => spell.classes.includes(className));
    }

    private async loadSpells(): Promise<void> {
        try {
            console.log('Loading spells from storage...');
            const data = await this.storage.loadSpellsData();
            this.spells = data?.spells || [];
            console.log('Spells loaded successfully:', this.spells.length);
        } catch (error) {
            console.error('Error loading spells:', error);
            this.spells = [];
        }
    }

    private async saveSpells(): Promise<void> {
        try {
            console.log('Saving spells to storage, count:', this.spells.length);
            
            const data: SpellsData = {
                spells: this.spells,
                lastUpdated: Date.now()
            };
            
            await this.storage.saveSpellsData(data);
            console.log('Spells saved successfully');
        } catch (error) {
            console.error('Error saving spells:', error);
            throw new Error(`Failed to save spells: ${error.message}`);
        }
    }

    generateId(): string {
        return 'spell_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}