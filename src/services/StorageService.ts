import { TFile, normalizePath } from 'obsidian';
import { Creature, BestiaryData } from 'src/models/Bestiary';
import { Spell, SpellsData } from 'src/models/Spells';

export class StorageService {
    private plugin: any;

    constructor(plugin: any) {
        this.plugin = plugin;
    }

    async loadBestiaryData(): Promise<BestiaryData> {
        try {
            const filePath = this.getBestiaryFilePath();
            console.log('Loading bestiary from:', filePath);
            
            const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                const content = await this.plugin.app.vault.read(file);
                const data = JSON.parse(content);
                console.log('Bestiary data loaded:', data.creatures?.length || 0, 'creatures');
                return data;
            }
            
            console.log('Bestiary file not found, creating default data');
            return { creatures: [], lastUpdated: Date.now() };
        } catch (error) {
            console.error('Error loading bestiary data:', error);
            return { creatures: [], lastUpdated: Date.now() };
        }
    }

    async saveBestiaryData(data: BestiaryData): Promise<void> {
        try {
            const filePath = this.getBestiaryFilePath();
            console.log('Saving bestiary to:', filePath, 'creatures:', data.creatures.length);
            
            await this.ensureStorageFolder();
            
            let file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                console.log('Updating existing bestiary file');
                await this.plugin.app.vault.modify(file, JSON.stringify(data, null, 2));
            } else {
                console.log('Creating new bestiary file');
                file = await this.plugin.app.vault.create(filePath, JSON.stringify(data, null, 2));
            }
            
            console.log('Bestiary data saved successfully');
            
        } catch (error) {
            console.error('Error saving bestiary data:', error);
            throw error;
        }
    }

    private getBestiaryFilePath(): string {
        return normalizePath('storage/bestiary.json');
    }

    async loadSpellsData(): Promise<SpellsData> {
        try {
            const filePath = this.getSpellsFilePath();
            console.log('Loading spells from:', filePath);
            
            const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                const content = await this.plugin.app.vault.read(file);
                const data = JSON.parse(content);
                console.log('Spells data loaded:', data.spells?.length || 0, 'spells');
                return data;
            }
            
            console.log('Spells file not found, creating default data');
            return { spells: [], lastUpdated: Date.now() };
        } catch (error) {
            console.error('Error loading spells data:', error);
            return { spells: [], lastUpdated: Date.now() };
        }
    }

    async saveSpellsData(data: SpellsData): Promise<void> {
        try {
            const filePath = this.getSpellsFilePath();
            console.log('Saving spells to:', filePath, 'spells:', data.spells.length);
            
            await this.ensureStorageFolder();
            
            let file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                console.log('Updating existing spells file');
                await this.plugin.app.vault.modify(file, JSON.stringify(data, null, 2));
            } else {
                console.log('Creating new spells file');
                file = await this.plugin.app.vault.create(filePath, JSON.stringify(data, null, 2));
            }
            
            console.log('Spells data saved successfully');
            
        } catch (error) {
            console.error('Error saving spells data:', error);
            throw new Error(`Failed to save spells: ${error.message}`);
        }
    }

    private getSpellsFilePath(): string {
        return normalizePath('storage/spells.json');
    }

    private async ensureStorageFolder(): Promise<void> {
        try {
            const storagePath = 'storage';
            const folder = this.plugin.app.vault.getAbstractFileByPath(storagePath);
            
            if (!folder) {
                console.log('Creating storage folder:', storagePath);
                await this.plugin.app.vault.createFolder(storagePath);
                console.log('Storage folder created successfully');
            }
        } catch (error) {
            if (error.message?.includes('already exists')) {
                console.log('Storage folder already exists');
            } else {
                console.error('Error ensuring storage folder:', error);
                throw error;
            }
        }
    }

    async loadData(): Promise<any> {
        return await this.loadBestiaryData();
    }

    async saveData(data: any): Promise<void> {
        // Для совместимости с основным плагином
        console.log('Save data called:', data);
    }
}