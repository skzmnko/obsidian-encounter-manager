export const SpellModalStyles = `
.spell-modal-container {
    max-height: 80vh;
    overflow-y: auto;
    padding-right: 10px;
}

.spell-modal-container::-webkit-scrollbar {
    width: 8px;
}

.spell-modal-container::-webkit-scrollbar-track {
    background: var(--background-secondary);
    border-radius: 4px;
}

.spell-modal-container::-webkit-scrollbar-thumb {
    background: var(--background-modifier-border);
    border-radius: 4px;
}

.spell-modal-container::-webkit-scrollbar-thumb:hover {
    background: var(--interactive-accent);
}

.selected-classes-container {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
}

.selected-values-title {
    font-weight: bold;
    margin-bottom: 5px;
    color: var(--text-normal);
    font-size: 14px;
}

.selected-values-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.selected-value-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    background: var(--background-primary);
    border-radius: 3px;
    border: 1px solid var(--background-modifier-border);
    font-size: 13px;
}

.selected-value-remove {
    background: var(--background-modifier-error);
    color: white;
    border: none;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    cursor: pointer;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.selected-value-remove:hover {
    background: var(--background-modifier-error-hover);
}

.components-section {
    margin: 15px 0;
    padding: 15px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
}

.components-section h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--text-normal);
}

.material-description-container {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
}

.description-section {
    margin: 15px 0;
}

.spell-textarea {
    resize: vertical !important;
    min-height: 80px !important;
    width: 100% !important;
    font-family: var(--font-monospace);
    font-size: 13px;
}

.cantrip-upgrade-textarea {
    resize: vertical !important;
    min-height: 60px !important;
    width: 100% !important;
    font-family: var(--font-monospace);
    font-size: 13px;
}

.spell-section-divider {
    border: none;
    border-top: 1px solid var(--background-modifier-border);
    margin: 20px 0;
}

/* Стили для чекбоксов и переключателей */
.spell-toggle-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0;
}

.spell-toggle-label {
    font-size: 14px;
    color: var(--text-normal);
}

/* Стили для выпадающих списков */
.spell-dropdown {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
}

.spell-dropdown:focus {
    border-color: var(--interactive-accent);
    outline: none;
}

/* Стили для текстовых полей */
.spell-text-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
}

.spell-text-input:focus {
    border-color: var(--interactive-accent);
    outline: none;
}

/* Стили для заголовков секций - ОБНОВЛЕНО для соответствия CreatureModalStyles */
.spell-section-title {
    text-align: center !important;
    width: 100% !important;
    margin: 20px 0 15px 0 !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    padding-bottom: 8px !important;
    color: var(--text-accent);
    font-size: 16px;
    font-weight: 600;
}

/* Анимации */
.spell-fade-in {
    animation: spellFadeIn 0.3s ease-in-out;
}

@keyframes spellFadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Адаптивность */
@media (max-width: 768px) {
    .spell-modal-container {
        max-height: 70vh;
    }
    
    .selected-value-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
    
    .selected-value-remove {
        align-self: flex-end;
    }
}

/* Дополнительные стили для соответствия CreatureModalStyles */
.creature-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
}

.section-title {
    text-align: center !important;
    width: 100% !important;
    margin: 20px 0 15px 0 !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    padding-bottom: 8px !important;
}
`;