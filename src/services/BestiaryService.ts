import { Creature, BestiaryData } from 'src/models/Bestiary';
import { StorageService } from 'src/services/StorageService';

export class BestiaryService {
    private storage: StorageService;
    private creatures: Creature[] = [];
    private isInitialized: boolean = false;

    constructor(plugin: any) {
        this.storage = new StorageService(plugin);
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        await this.loadCreatures();
        this.isInitialized = true;
        console.log('BestiaryService initialized with', this.creatures.length, 'creatures');
    }

    async createCreature(creatureData: Omit<Creature, 'id' | 'created' | 'updated'>): Promise<Creature> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const creature: Creature = {
            ...creatureData,
            id: this.generateId(),
            created: Date.now(),
            updated: Date.now()
        };

        console.log('Creating new creature:', creature.name);
        
        // Добавляем и сразу сохраняем
        this.creatures.push(creature);
        
        try {
            await this.saveCreatures();
            console.log('Creature created successfully, total creatures:', this.creatures.length);
            return creature;
        } catch (error) {
            // Откатываем изменения в памяти при ошибке сохранения
            this.creatures.pop();
            console.error('Failed to save creature, rolling back:', error);
            throw error;
        }
    }

    async getCreature(id: string): Promise<Creature | undefined> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.creatures.find(creature => creature.id === id);
    }

    async updateCreature(id: string, updates: Partial<Creature>): Promise<Creature | null> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const index = this.creatures.findIndex(creature => creature.id === id);
        if (index === -1) return null;

        const originalCreature = { ...this.creatures[index] };
        
        this.creatures[index] = {
            ...this.creatures[index],
            ...updates,
            updated: Date.now()
        };

        try {
            await this.saveCreatures();
            return this.creatures[index];
        } catch (error) {
            // Откатываем изменения при ошибке
            this.creatures[index] = originalCreature;
            console.error('Failed to update creature, rolling back:', error);
            throw error;
        }
    }

    async deleteCreature(id: string): Promise<boolean> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const index = this.creatures.findIndex(creature => creature.id === id);
        if (index === -1) return false;

        const [deletedCreature] = this.creatures.splice(index, 1);
        
        try {
            await this.saveCreatures();
            return true;
        } catch (error) {
            // Восстанавливаем при ошибке
            this.creatures.splice(index, 0, deletedCreature);
            console.error('Failed to delete creature, rolling back:', error);
            throw error;
        }
    }

    getAllCreatures(): Creature[] {
        return [...this.creatures];
    }

    getCreaturesByType(type: string): Creature[] {
        return this.creatures.filter(creature => creature.type === type);
    }

    private async loadCreatures(): Promise<void> {
        try {
            console.log('Loading creatures from storage...');
            const data = await this.storage.loadBestiaryData();
            this.creatures = data?.creatures || [];
            console.log('Creatures loaded successfully:', this.creatures.length);
        } catch (error) {
            console.error('Error loading creatures:', error);
            this.creatures = [];
        }
    }

    private async saveCreatures(): Promise<void> {
        try {
            console.log('Saving creatures to storage, count:', this.creatures.length);
            
            const data: BestiaryData = {
                creatures: this.creatures,
                lastUpdated: Date.now()
            };
            
            await this.storage.saveBestiaryData(data);
            console.log('Creatures saved successfully');
        } catch (error) {
            console.error('Error saving creatures:', error);
            throw new Error(`Failed to save creatures: ${error.message}`);
        }
    }

    generateId(): string {
        return 'creature_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}