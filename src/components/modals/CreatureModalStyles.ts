export const CreatureModalStyles = `
.abilities-horizontal-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    font-family: var(--font-interface);
    font-size: var(--font-ui-small);
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
    font-family: var(--font-interface);
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
    font-family: var(--font-interface);
    font-size: var(--font-ui-small);
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
    font-family: var(--font-interface);
    font-size: var(--font-ui-small);
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
    font-family: var(--font-interface);
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
    font-family: var(--font-interface);
    font-size: var(--font-ui-small);
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
    font-family: var(--font-interface);
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
    font-family: var(--font-interface);
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
    font-family: var(--font-interface);
    font-size: var(--font-ui-small);
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
    font-family: var(--font-interface);
}

.selected-value-remove:hover {
    background: var(--background-modifier-error-hover);
}

.selected-values-empty {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: 10px;
    font-family: var(--font-interface);
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
    font-family: var(--font-interface);
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
    font-family: var(--font-interface);
}

.trait-remove, .action-remove {
    margin-top: 5px;
    font-family: var(--font-interface);
}

.traits-empty, .actions-empty {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: 20px;
    border: 1px dashed var(--background-modifier-border);
    border-radius: 4px;
    font-family: var(--font-interface);
}

.creature-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--background-modifier-border);
}

.challenge-rating-dropdown {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background: var(--background-primary);
    color: var(--text-normal);
    font-family: var(--font-interface);
    font-size: var(--font-ui-small);
}

.challenge-rating-dropdown:focus {
    border-color: var(--interactive-accent);
    outline: none;
}

/* Styles for text areas with fixed size */
.languages-textarea,
.skills-textarea,
.senses-textarea,
.alchemy-textarea,
.craft-textarea,
.statements-textarea,
.tactics-textarea,
.notable-items-textarea,
.trait-desc-textarea,
.action-desc-textarea,
.bonus-action-desc-textarea,
.reaction-desc-textarea,
.legendary-action-desc-textarea {
    resize: none !important;
    min-height: 60px !important;
    width: 100% !important;
    /* CHANGE: Unified font for all text areas */
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
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

/* Centering section headers */
.creature-section h3 {
    text-align: center !important;
    width: 100% !important;
    margin: 20px 0 15px 0 !important;
    border-bottom: 1px solid var(--background-modifier-border) !important;
    padding-bottom: 8px !important;
    /* EXCEPTION: Headers remain unchanged */
}

/* CHANGE: Unified styles for all Setting elements in Creature modal */
.mod-creature-creation .setting-item-name,
.mod-creature-creation .setting-item-description {
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
}

/* CHANGE: Unified styles for buttons in Creature modal */
.mod-creature-creation .button-container button {
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
}

/* CHANGE: Unified styles for all text input fields in Creature modal */
.mod-creature-creation input[type="text"],
.mod-creature-creation textarea,
.mod-creature-creation select {
    font-family: var(--font-interface) !important;
    font-size: var(--font-ui-small) !important;
}

/* Styles for spell counting mode selection */
.spell-counting-container {
  margin: 10px 0;
  padding: 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-secondary);
}

.spell-counting-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-normal);
  font-size: 14px;
  font-family: var(--font-interface);
  text-align: center;
}

/* Горизонтальное расположение радиокнопок */
.spell-counting-radio-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px; /* Расстояние между опциями по горизонтали */
}

.spell-counting-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.spell-counting-option:hover {
  background: var(--background-modifier-hover);
}

.spell-counting-option input[type="radio"] {
  margin: 0;
}

.spell-counting-option label {
  font-family: var(--font-interface);
  font-size: var(--font-ui-small);
  color: var(--text-normal);
  cursor: pointer;
  white-space: nowrap;
}

/* Styles for spell options container */
.spell-options-container {
  margin: 10px 0;
  padding: 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-secondary);
}

.spell-option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 6px 0;
}

.spell-option-row:last-child {
  margin-bottom: 0;
}

.spell-option-row input[type="checkbox"] {
  margin: 0;
}

.spell-option-row label {
  font-family: var(--font-interface);
  font-size: var(--font-ui-small);
  color: var(--text-normal);
  cursor: pointer;
  min-width: 180px;
}

.spell-select-dropdown {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-family: var(--font-interface);
  font-size: var(--font-ui-small);
}

.spell-select-dropdown:focus {
  border-color: var(--interactive-accent);
  outline: none;
}

/* Ensure consistent styling with other modal elements */
.mod-creature-creation .spell-counting-container {
  font-family: var(--font-interface) !important;
}

.mod-creature-creation .spell-counting-option label {
  font-family: var(--font-interface) !important;
  font-size: var(--font-ui-small) !important;
}

.mod-creature-creation .spell-options-container {
  font-family: var(--font-interface) !important;
}
`;