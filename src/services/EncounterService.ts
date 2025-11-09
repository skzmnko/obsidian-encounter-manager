import { Encounter, Participant } from 'src/models/Encounter';
import { StorageService } from 'src/services/StorageService';

export class EncounterService {
    private storage: StorageService;
    private encounters: Encounter[] = [];

    constructor(plugin: any) {
        this.storage = new StorageService(plugin);
    }

    async initialize(): Promise<void> {
        await this.loadEncounters();
    }

    async createEncounter(encounterData: Omit<Encounter, 'id' | 'created' | 'updated'>): Promise<Encounter> {
        const encounter: Encounter = {
            ...encounterData,
            id: this.generateId(),
            created: Date.now(),
            updated: Date.now()
        };

        this.encounters.push(encounter);
        await this.saveEncounters();
        
        return encounter;
    }

    async getEncounter(id: string): Promise<Encounter | undefined> {
        return this.encounters.find(enc => enc.id === id);
    }

    async updateEncounter(id: string, updates: Partial<Encounter>): Promise<Encounter | null> {
        const index = this.encounters.findIndex(enc => enc.id === id);
        if (index === -1) return null;

        this.encounters[index] = {
            ...this.encounters[index],
            ...updates,
            updated: Date.now()
        };

        await this.saveEncounters();
        return this.encounters[index];
    }

    async deleteEncounter(id: string): Promise<boolean> {
        const index = this.encounters.findIndex(enc => enc.id === id);
        if (index === -1) return false;

        this.encounters.splice(index, 1);
        await this.saveEncounters();
        return true;
    }

    getAllEncounters(): Encounter[] {
        return [...this.encounters];
    }

    getEncountersByType(type: Encounter['type']): Encounter[] {
        return this.encounters.filter(enc => enc.type === type);
    }

    private async loadEncounters(): Promise<void> {
        try {
            const data = await this.storage.loadData();
            this.encounters = data?.encounters || [];
        } catch (error) {
            console.error('Error loading encounters:', error);
            this.encounters = [];
        }
    }

    private async saveEncounters(): Promise<void> {
        try {
            const data = await this.storage.loadData() || {};
            data.encounters = this.encounters;
            await this.storage.saveData(data);
        } catch (error) {
            console.error('Error saving encounters:', error);
        }
    }

    generateId(): string {
        return 'enc_' + Math.random().toString(36).substr(2, 9);
    }

    generateParticipantId(): string {
        return 'part_' + Math.random().toString(36).substr(2, 9);
    }

    getEncounterTypeLabel(type: string): string {
        const typeLabels: { [key: string]: string } = {
            'combat': 'Сражение',
            'hazard': 'Опасная область',
            'chase': 'Погоня',
            'random': 'Случайные события'
        };
        return typeLabels[type] || type;
    }
}