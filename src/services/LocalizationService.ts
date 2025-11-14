import { LOCALE_EN, LOCALE_RU, LocaleKey } from 'src/constants/i18n';

export class LocalizationService {
    private currentLocale: 'en' | 'ru' = 'en';
    private dictionaries = {
        en: LOCALE_EN,
        ru: LOCALE_RU
    };

    setLocale(locale: 'en' | 'ru') {
        this.currentLocale = locale;
    }

    getCurrentLocale(): 'en' | 'ru' {
        return this.currentLocale;
    }

    t(key: string, params?: { [key: string]: string }): string {
        const keys = key.split('.');
        let value: any = this.dictionaries[this.currentLocale];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Localization key not found: ${key}`);
                return this.getFallback(key);
            }
        }

        if (params && typeof value === 'string') {
            return this.replaceParams(value, params);
        }
        
        return value;
    }

    // Get all available locales
    getAvailableLocales(): Array<{ code: 'en' | 'ru'; name: string }> {
        return [
            { code: 'en', name: 'English' },
            { code: 'ru', name: 'Русский' }
        ];
    }

    private replaceParams(text: string, params: { [key: string]: string }): string {
        return text.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
    }

    private getFallback(key: string): string {
        // Try English as fallback
        const keys = key.split('.');
        let value: any = LOCALE_EN;
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return key; // Return key name as last resort
            }
        }
        
        return value;
    }
}

// Singleton instance
export const i18n = new LocalizationService();