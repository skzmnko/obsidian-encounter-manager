export const CreatureModalStyles = `
.abilities-horizontal-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.ability-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 60px;
}

.ability-label {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
    color: var(--text-normal);
}

.ability-input {
    width: 100%;
    text-align: center;
    padding: 5px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
    margin-bottom: 3px;
}

.ability-input:focus {
    border-color: var(--interactive-accent);
    outline: none;
}

.ability-modifier-input {
    width: 100%;
    text-align: center;
    padding: 5px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
    color: var(--text-muted);
    font-style: italic;
    cursor: not-allowed;
}

.saving-throws-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.saving-throw-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 60px;
}

.saving-throw-label {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
    color: var(--text-normal);
}

.saving-throw-input {
    width: 100%;
    text-align: center;
    padding: 5px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-secondary);
    color: var(--text-normal);
    cursor: pointer;
    transition: all 0.2s ease;
}

.saving-throw-input:hover {
    background: var(--background-modifier-hover);
}

.saving-throw-input.saving-throw-active {
    background: var(--interactive-accent);
    color: var(--text-on-accent);
    border-color: var(--interactive-accent-hover);
    font-weight: bold;
}

.saving-throw-hint {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 2px;
    font-style: italic;
}

.selected-values-container {
    margin-bottom: 15px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 10px;
    background: var(--background-secondary);
}

.selected-values-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--text-normal);
    font-size: 14px;
}

.selected-values-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.selected-value-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    background: var(--background-primary);
    border-radius: 3px;
    border: 1px solid var(--background-modifier-border);
}

.selected-value-remove {
    background: var(--background-modifier-error);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.selected-value-remove:hover {
    background: var(--background-modifier-error-hover);
}

.selected-values-empty {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: 10px;
}

.add-trait-container, .add-action-container {
    margin-bottom: 20px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 15px;
    background: var(--background-secondary);
}

.traits-list-container, .actions-list-container {
    margin-bottom: 20px;
}

.traits-list-title, .actions-list-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--text-normal);
    font-size: 14px;
}

.traits-list, .actions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.trait-item, .action-item {
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 10px;
    background: var(--background-primary);
    position: relative;
}

.trait-header, .action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.trait-desc, .action-desc {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 8px;
}

.trait-remove, .action-remove {
    margin-top: 5px;
}

.traits-empty, .actions-empty {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: 20px;
    border: 1px dashed var(--background-modifier-border);
    border-radius: 4px;
}

.creature-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
}

/* Стили для текстовых областей с фиксированным размером */
.fixed-textarea {
    resize: none !important;
    min-height: 80px !important;
    width: 100% !important;
}

/* Стили для широких текстовых областей */
.wide-textarea {
    resize: none !important;
    min-height: 100px !important;
    width: 100% !important;
}

/* Специфичные стили для различных типов полей */
.languages-textarea,
.skills-textarea,
.senses-textarea,
.notes-textarea {
    resize: none !important;
    min-height: 60px !important;
    width: 100% !important;
}

.trait-desc-textarea,
.action-desc-textarea,
.bonus-action-desc-textarea,
.reaction-desc-textarea,
.legendary-action-desc-textarea {
    resize: none !important;
    min-height: 100px !important;
    width: 100% !important;
}
`;