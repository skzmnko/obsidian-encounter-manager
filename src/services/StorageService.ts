import { TFile, normalizePath } from 'obsidian';
import { Creature, BestiaryData } from 'src/models/Bestiary';

export class StorageService {
    private plugin: any;

    constructor(plugin: any) {
        this.plugin = plugin;
    }

    async loadEncountersByDate(date: Date): Promise<any> {
        try {
            const fileName = this.getDateFileName(date);
            const filePath = this.getEncountersFilePath(fileName);
            
            const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                const content = await this.plugin.app.vault.read(file);
                return JSON.parse(content);
            }
            
            return { encounters: [], lastUpdated: Date.now() };
        } catch (error) {
            console.error('Error loading encounters by date:', error);
            return { encounters: [], lastUpdated: Date.now() };
        }
    }

    async saveEncountersByDate(date: Date, data: any): Promise<void> {
        try {
            const fileName = this.getDateFileName(date);
            const filePath = this.getEncountersFilePath(fileName);
            
            let file = this.plugin.app.vault.getAbstractFileByPath(filePath);
            
            if (file && file instanceof TFile) {
                await this.plugin.app.vault.modify(file, JSON.stringify(data, null, 2));
            } else {
                file = await this.plugin.app.vault.create(filePath, JSON.stringify(data, null, 2));
            }
            
        } catch (error) {
            console.error('Error saving encounters by date:', error);
            throw error;
        }
    }

    private getDateFileName(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `encounters_${day}.${month}.${year}.json`;
    }

    private getEncountersFolderPath(): string {
        return normalizePath(`${this.plugin.manifest.dir}/encounters`);
    }

    private getEncountersFilePath(fileName: string): string {
        return normalizePath(`${this.getEncountersFolderPath()}/${fileName}`);
    }

    // МЕТОДЫ ДЛЯ BESTIARY - ИСПРАВЛЕННЫЕ
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
            
            // Убедимся, что папка существует
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

    // ИСПРАВЛЕННЫЙ ПУТЬ - используем корень vault
    private getBestiaryFilePath(): string {
        return normalizePath('storage/bestiary.json');
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
            // Игнорируем ошибку "папка уже существует"
            if (error.message?.includes('already exists')) {
                console.log('Storage folder already exists');
            } else {
                console.error('Error ensuring storage folder:', error);
                throw error;
            }
        }
    }

    // Старые методы для обратной совместимости
    async loadData(): Promise<any> {
        return await this.loadEncountersByDate(new Date());
    }

    async saveData(data: any): Promise<void> {
        await this.saveEncountersByDate(new Date(), data);
    }
}