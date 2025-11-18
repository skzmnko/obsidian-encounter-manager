import { LOCALE_EN, LOCALE_RU } from 'src/constants/bestiary_i18n';
import { SPELLS_LOCALE_EN, SPELLS_LOCALE_RU } from 'src/constants/spells_i18n';
import { 
    GAME_DATA_EN, 
    GAME_DATA_RU,
    GameDataKey, 
    CreatureTypeKey,
    SizeKey, 
    AlignmentKey, 
    DamageTypeKey, 
    ConditionKey,
    ConditionDescriptionKey,
    SpellSchoolKey,
    SpellClassKey,
    ActionTypeKey
} from 'src/constants/game_data_i18n';

type GameDataCategory = 
    | { [key in CreatureTypeKey]: string }
    | { [key in SizeKey]: string }
    | { [key in AlignmentKey]: string }
    | { [key in DamageTypeKey]: string }
    | { [key in ConditionKey]: string }
    | { [key in ConditionDescriptionKey]: string }
    | { [key in SpellSchoolKey]: string }
    | { [key in SpellClassKey]: string }
    | { [key in ActionTypeKey]: string };

export class LocalizationService {
    private currentLocale: 'en' | 'ru' = 'en';
    private uiDictionaries = {
        en: { ...LOCALE_EN, ...SPELLS_LOCALE_EN },
        ru: { ...LOCALE_RU, ...SPELLS_LOCALE_RU }
    };
    private gameDataDictionaries = {
        en: GAME_DATA_EN,
        ru: GAME_DATA_RU
    };
    private onChangeCallbacks: Array<(locale: 'en' | 'ru') => void> = [];

    setLocale(locale: 'en' | 'ru') {
        if (this.currentLocale !== locale) {
            this.currentLocale = locale;
            this.notifyLocaleChange(locale);
        }
    }

    getCurrentLocale(): 'en' | 'ru' {
        return this.currentLocale;
    }

    t(key: string, params?: { [key: string]: string }): string {
        const keys = key.split('.');
        let value: any = this.uiDictionaries[this.currentLocale];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Localization key not found: ${key}`);
                return this.getUIFallback(key);
            }
        }

        if (params && typeof value === 'string') {
            return this.replaceParams(value, params);
        }
        
        return value;
    }

    getGameData(category: GameDataKey, key: string): string {
        const dict = this.gameDataDictionaries[this.currentLocale];
        const categoryData = dict[category] as any;
        return categoryData?.[key] || key;
    }

    getGameDataCategory(category: GameDataKey): { [key: string]: string } {
        const dict = this.gameDataDictionaries[this.currentLocale];
        const categoryData = dict[category] as any;
        
        if (!categoryData) return {};
        
        const result: { [key: string]: string } = {};
        Object.keys(categoryData).forEach(key => {
            result[key] = categoryData[key];
        });
        
        return result;
    }

    getCreatureType(key: CreatureTypeKey): string {
        return this.getGameData('CREATURE_TYPES', key);
    }

    getSize(key: SizeKey): string {
        return this.getGameData('SIZES', key);
    }

    getAlignment(key: AlignmentKey): string {
        return this.getGameData('ALIGNMENTS', key);
    }

    getDamageType(key: DamageTypeKey): string {
        return this.getGameData('DAMAGE_TYPES', key);
    }

    getCondition(key: ConditionKey): string {
        return this.getGameData('CONDITIONS', key);
    }

    getConditionDescription(key: ConditionKey): string {
        return this.getGameData('CONDITION_DESCRIPTIONS', key);
    }

    getSpellSchool(key: SpellSchoolKey): string {
        return this.getGameData('SPELL_SCHOOLS', key);
    }

    getSpellClass(key: SpellClassKey): string {
        return this.getGameData('SPELL_CLASSES', key);
    }

    getActionType(key: ActionTypeKey): string {
        return this.getGameData('ACTION_TYPES', key);
    }

    getAllConditionDescriptions(): { [key: string]: string } {
        return this.getGameDataCategory('CONDITION_DESCRIPTIONS');
    }

    getAvailableLocales(): Array<{ code: 'en' | 'ru'; name: string }> {
        return [
            { code: 'en', name: 'English' },
            { code: 'ru', name: 'Русский' }
        ];
    }

    onLocaleChange(callback: (locale: 'en' | 'ru') => void): void {
        this.onChangeCallbacks.push(callback);
    }

    offLocaleChange(callback: (locale: 'en' | 'ru') => void): void {
        const index = this.onChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.onChangeCallbacks.splice(index, 1);
        }
    }

    private notifyLocaleChange(locale: 'en' | 'ru'): void {
        this.onChangeCallbacks.forEach(callback => callback(locale));
    }

    private replaceParams(text: string, params: { [key: string]: string }): string {
        return text.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
    }

    private getUIFallback(key: string): string {
        const keys = key.split('.');
        let value: any = { ...LOCALE_EN, ...SPELLS_LOCALE_EN };
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return value;
    }
}

export const i18n = new LocalizationService();