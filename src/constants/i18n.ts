// English locale
export const LOCALE_EN = {
    CREATURE_MODAL: {
        TITLE: 'Add Creature to Bestiary',
        SAVE_BUTTON: 'Save',
        CANCEL_BUTTON: 'Cancel',
        SUCCESS: 'Creature "{name}" added to bestiary!',
        ERROR: 'Error saving creature: {message}',
        VALIDATION_NAME: 'Please enter creature name'
    },
    BESTIARY: {
        TITLE: 'Bestiary',
        ADD_CREATURE: 'Add Creature',
        NO_CREATURES: 'No creatures added yet. Click "Add Creature" to create the first one.',
        DELETE_SUCCESS: 'Creature "{name}" deleted',
        EDIT: 'Edit',
        DELETE: 'Delete'
    },
    COMMON: {
        SAVE: 'Save',
        CANCEL: 'Cancel',
        DELETE: 'Delete',
        EDIT: 'Edit',
        ADD: 'Add',
        CREATE: 'Create',
        UPDATE: 'Update',
        REMOVE: 'Remove',
        CONFIRM: 'Confirm',
        CLOSE: 'Close',
        YES: 'Yes',
        NO: 'No',
        OK: 'OK'
    }
} as const;

// Russian locale
export const LOCALE_RU = {
    CREATURE_MODAL: {
        TITLE: 'Добавить существо в бестиарий',
        SAVE_BUTTON: 'Сохранить',
        CANCEL_BUTTON: 'Отмена',
        SUCCESS: 'Существо "{name}" добавлено в бестиарий!',
        ERROR: 'Ошибка при сохранении существа: {message}',
        VALIDATION_NAME: 'Пожалуйста, введите имя существа'
    },
    BESTIARY: {
        TITLE: 'Бестиарий',
        ADD_CREATURE: 'Добавить существо',
        NO_CREATURES: 'Существа еще не добавлены. Нажмите "Добавить существо" чтобы создать первое.',
        DELETE_SUCCESS: 'Существо "{name}" удалено',
        EDIT: 'Редактировать',
        DELETE: 'Удалить'
    },
    COMMON: {
        SAVE: 'Сохранить',
        CANCEL: 'Отмена',
        DELETE: 'Удалить',
        EDIT: 'Редактировать',
        ADD: 'Добавить',
        CREATE: 'Создать',
        UPDATE: 'Обновить',
        REMOVE: 'Удалить',
        CONFIRM: 'Подтвердить',
        CLOSE: 'Закрыть',
        YES: 'Да',
        NO: 'Нет',
        OK: 'ОК'
    }
} as const;

export type LocaleKey = keyof typeof LOCALE_EN;