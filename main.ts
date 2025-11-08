import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Интерфейсы для типизации
interface Participant {
  id: string;
  name: string;
  type: 'pc' | 'npc' | 'monster' | 'trap';
  hp: number;
  maxHp: number;
  ac: number;
  initiative?: number;
  notes?: string;
}

interface Encounter {
  id: string;
  name: string;
  description: string;
  type: 'combat' | 'hazard' | 'chase' | 'random';
  participants: Participant[];
  created: number;
  updated: number;
}

interface EncounterManagerSettings {
  defaultHP: number;
  autoSave: boolean;
  roundTimer: number;
  encountersFolder: string;
}

const DEFAULT_SETTINGS: EncounterManagerSettings = {
  defaultHP: 100,
  autoSave: true,
  roundTimer: 60,
  encountersFolder: 'Encounters'
}

export default class EncounterManagerPlugin extends Plugin {
  settings!: EncounterManagerSettings;
  encounters: Encounter[] = [];

  async onload() {
    await this.loadSettings();
    await this.loadEncounters();

    // Добавляем команду для создания нового энкаунтера
    this.addCommand({
      id: 'create-encounter',
      name: 'Create new encounter',
      callback: () => {
        new EncounterTypeModal(this.app, this).open();
      }
    });

    // Добавляем иконку в боковую панель
    this.addRibbonIcon('swords', 'Encounter Manager', () => {
      new EncounterTypeModal(this.app, this).open();
    });

    // Добавляем вкладку настроек
    this.addSettingTab(new EncounterManagerSettingTab(this.app, this));

    // Регистрируем код блок для отображения энкаунтеров
    this.registerMarkdownCodeBlockProcessor('encounter', (source, el, ctx) => {
      this.renderEncounterBlock(source, el, ctx);
    });

    console.log('Encounter Manager plugin loaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async loadEncounters() {
    const data = await this.loadData();
    this.encounters = data?.encounters || [];
  }

  async saveEncounters() {
    const data = await this.loadData() || {};
    data.encounters = this.encounters;
    await this.saveData(data);
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

  generateId(): string {
    return 'enc_' + Math.random().toString(36).substr(2, 9);
  }

  renderEncounterBlock(source: string, el: HTMLElement, ctx: any) {
    try {
      const encounterData = JSON.parse(source);
      
      const container = el.createDiv({ cls: 'encounter-block' });
      const header = container.createDiv({ cls: 'encounter-header' });
      header.createEl('h3', { text: encounterData.name });
      
      const typeBadge = header.createSpan({ cls: 'encounter-type' });
      typeBadge.setText(this.getEncounterTypeLabel(encounterData.type));
      typeBadge.addClass(`encounter-type-${encounterData.type}`);
      
      const openBtn = header.createEl('button', { text: 'Открыть энкаунтер', cls: 'mod-cta' });
      openBtn.addEventListener('click', () => {
        new EncounterViewModal(this.app, this, encounterData).open();
      });

      // Отображаем описание
      if (encounterData.description) {
        const description = container.createDiv({ cls: 'encounter-description' });
        description.setText(encounterData.description);
      }

      // Отображаем участников для сражений
      if (encounterData.type === 'combat' && encounterData.participants && encounterData.participants.length > 0) {
        const participantsSection = container.createDiv({ cls: 'encounter-participants' });
        participantsSection.createEl('h4', { text: 'Участники' });
        
        const participantList = participantsSection.createDiv({ cls: 'participant-list' });
        encounterData.participants.forEach((participant: Participant) => {
          const participantEl = participantList.createDiv({ cls: 'participant-item' });
          participantEl.setText(`${participant.name} (${participant.type}) - HP: ${participant.hp}/${participant.maxHp}`);
        });
      }

      // Отображаем дополнительные параметры в зависимости от типа
      this.renderEncounterSpecificInfo(container, encounterData);

    } catch (error) {
      console.error('Error rendering encounter block:', error);
      el.setText('Error: Invalid encounter data');
    }
  }

  renderEncounterSpecificInfo(container: HTMLElement, encounterData: any) {
    const infoSection = container.createDiv({ cls: 'encounter-info' });
    
    switch (encounterData.type) {
      case 'combat':
        if (encounterData.difficulty) {
          infoSection.createEl('p', { text: `Сложность: ${encounterData.difficulty}` });
        }
        if (encounterData.environment) {
          infoSection.createEl('p', { text: `Локация: ${encounterData.environment}` });
        }
        break;
      case 'hazard':
        if (encounterData.dangerLevel) {
          infoSection.createEl('p', { text: `Уровень опасности: ${encounterData.dangerLevel}` });
        }
        break;
      case 'chase':
        if (encounterData.complexity) {
          infoSection.createEl('p', { text: `Сложность погони: ${encounterData.complexity}` });
        }
        break;
      case 'random':
        if (encounterData.eventType) {
          infoSection.createEl('p', { text: `Тип события: ${encounterData.eventType}` });
        }
        break;
    }
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

  // Метод для вставки энкаунтера в текущую заметку
  insertEncounterToCurrentNote(encounter: Encounter) {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView) {
      const editor = activeView.editor;
      const encounterBlock = `\n\n\`\`\`encounter\n${JSON.stringify(encounter, null, 2)}\n\`\`\`\n\n`;
      editor.replaceSelection(encounterBlock);
    }
  }
}

// Модальное окно выбора типа энкаунтера
class EncounterTypeModal extends Modal {
  plugin: EncounterManagerPlugin;

  constructor(app: App, plugin: EncounterManagerPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Создание энкаунтера' });
    contentEl.createEl('p', { text: 'Выберите тип энкаунтера:' });

    const types = [
      { id: 'combat', label: '⚔️ Сражение', description: 'Боевое столкновение с противниками' },
      { id: 'hazard', label: '⚠️ Опасная область', description: 'Ловушки, опасная местность' },
      { id: 'chase', label: '🏃 Погоня', description: 'Динамическое преследование' },
      { id: 'random', label: '🎲 Случайные события', description: 'Непредвиденные встречи' }
    ];

    types.forEach(type => {
      const typeButton = contentEl.createEl('button', {
        text: type.label,
        cls: 'encounter-type-button'
      });

      typeButton.addEventListener('click', () => {
        this.close();
        new EncounterCreationModal(this.app, this.plugin, type.id as any).open();
      });

      const desc = contentEl.createEl('p', {
        text: type.description,
        cls: 'encounter-type-description'
      });
    });
  }
}

// Модальное окно создания энкаунтера
class EncounterCreationModal extends Modal {
  plugin: EncounterManagerPlugin;
  type: 'combat' | 'hazard' | 'chase' | 'random';
  name: string = '';
  description: string = '';
  
  // Поля для сражения
  difficulty: string = 'medium';
  environment: string = '';
  participants: Participant[] = [];

  constructor(app: App, plugin: EncounterManagerPlugin, type: 'combat' | 'hazard' | 'chase' | 'random') {
    super(app);
    this.plugin = plugin;
    this.type = type;
  }

  onOpen() {
    const { contentEl } = this;
    const typeLabel = this.plugin.getEncounterTypeLabel(this.type);
    contentEl.createEl('h2', { text: `Создание энкаунтера: ${typeLabel}` });

    // Общие поля для всех типов
    new Setting(contentEl)
      .setName('Название')
      .setDesc('Название энкаунтера')
      .addText(text => text
        .setPlaceholder('Введите название...')
        .onChange(value => {
          this.name = value;
        }));

    new Setting(contentEl)
      .setName('Описание')
      .setDesc('Описание энкаунтера')
      .addTextArea(text => text
        .setPlaceholder('Опишите энкаунтер...')
        .onChange(value => {
          this.description = value;
        }));

    // Специфичные поля в зависимости от типа
    this.renderTypeSpecificFields(contentEl);

    // Кнопка создания
    new Setting(contentEl)
      .addButton(btn => btn
        .setButtonText('Создать энкаунтер')
        .setCta()
        .onClick(async () => {
          if (!this.name.trim()) {
            new Notice('Пожалуйста, введите название энкаунтера');
            return;
          }

          const encounterData: any = {
            name: this.name,
            description: this.description,
            type: this.type,
            participants: this.participants
          };

          // Добавляем специфичные поля
          if (this.type === 'combat') {
            encounterData.difficulty = this.difficulty;
            encounterData.environment = this.environment;
          }

          const encounter = await this.plugin.createEncounter(encounterData);
          
          // Вставляем энкаунтер в текущую заметку
          this.plugin.insertEncounterToCurrentNote(encounter);
          
          this.close();
          new Notice(`Энкаунтер "${encounter.name}" создан!`);
        }));
  }

  renderTypeSpecificFields(contentEl: HTMLElement) {
    switch (this.type) {
      case 'combat':
        this.renderCombatFields(contentEl);
        break;
      case 'hazard':
        this.renderHazardFields(contentEl);
        break;
      case 'chase':
        this.renderChaseFields(contentEl);
        break;
      case 'random':
        this.renderRandomFields(contentEl);
        break;
    }
  }

  renderCombatFields(contentEl: HTMLElement) {
    contentEl.createEl('h3', { text: 'Параметры сражения' });

    // Сложность
    new Setting(contentEl)
      .setName('Сложность')
      .setDesc('Уровень сложности сражения')
      .addDropdown(dropdown => dropdown
        .addOption('easy', 'Легкая')
        .addOption('medium', 'Средняя')
        .addOption('hard', 'Сложная')
        .addOption('deadly', 'Смертельная')
        .setValue(this.difficulty)
        .onChange(value => {
          this.difficulty = value;
        }));

    // Локация
    new Setting(contentEl)
      .setName('Локация')
      .setDesc('Место проведения сражения')
      .addText(text => text
        .setPlaceholder('Лес, подземелье, город...')
        .onChange(value => {
          this.environment = value;
        }));

    // Участники
    contentEl.createEl('h3', { text: 'Участники сражения' });
    
    const addParticipantBtn = contentEl.createEl('button', { 
      text: 'Добавить участника',
      cls: 'mod-cta'
    });
    
    addParticipantBtn.addEventListener('click', () => {
      new CombatParticipantModal(this.app, this).open();
    });

    // Список добавленных участников
    this.participantsContainer = contentEl.createDiv({ cls: 'participants-list' });
    this.updateParticipantsList();
  }

  renderHazardFields(contentEl: HTMLElement) {
    contentEl.createEl('h3', { text: 'Параметры опасной области' });
    // Добавьте поля для опасных областей
  }

  renderChaseFields(contentEl: HTMLElement) {
    contentEl.createEl('h3', { text: 'Параметры погони' });
    // Добавьте поля для погони
  }

  renderRandomFields(contentEl: HTMLElement) {
    contentEl.createEl('h3', { text: 'Параметры случайного события' });
    // Добавьте поля для случайных событий
  }

  participantsContainer: HTMLElement;

  updateParticipantsList() {
    if (!this.participantsContainer) return;
    
    this.participantsContainer.empty();
    
    if (this.participants.length === 0) {
      this.participantsContainer.setText('Участники не добавлены');
      return;
    }

    this.participants.forEach((participant, index) => {
      const participantEl = this.participantsContainer.createDiv({ 
        cls: 'participant-item' 
      });
      
      participantEl.setText(
        `${participant.name} (${participant.type}) - HP: ${participant.hp}/${participant.maxHp}, AC: ${participant.ac}`
      );

      const removeBtn = participantEl.createEl('button', {
        text: 'Удалить',
        cls: 'mod-warning'
      });
      
      removeBtn.style.marginLeft = '10px';
      removeBtn.addEventListener('click', () => {
        this.participants.splice(index, 1);
        this.updateParticipantsList();
      });
    });
  }

  addParticipant(participant: Omit<Participant, 'id'>) {
    const newParticipant: Participant = {
      ...participant,
      id: 'part_' + Math.random().toString(36).substr(2, 9)
    };
    
    this.participants.push(newParticipant);
    this.updateParticipantsList();
  }
}

// Модальное окно добавления участника боя
class CombatParticipantModal extends Modal {
  parentModal: EncounterCreationModal;
  name: string = '';
  type: 'pc' | 'npc' | 'monster' | 'trap' = 'monster';
  hp: number = 30;
  maxHp: number = 30;
  ac: number = 13;

  constructor(app: App, parentModal: EncounterCreationModal) {
    super(app);
    this.parentModal = parentModal;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: 'Добавить участника' });

    // Имя участника
    new Setting(contentEl)
      .setName('Имя')
      .setDesc('Имя участника')
      .addText(text => text
        .setPlaceholder('Гоблин-воин')
        .onChange(value => {
          this.name = value;
        }));

    // Тип участника
    new Setting(contentEl)
      .setName('Тип')
      .setDesc('Тип участника')
      .addDropdown(dropdown => dropdown
        .addOption('pc', 'Игрок')
        .addOption('npc', 'NPC')
        .addOption('monster', 'Монстр')
        .addOption('trap', 'Ловушка')
        .setValue(this.type)
        .onChange(value => {
          this.type = value as any;
        }));

    // HP
    new Setting(contentEl)
      .setName('Текущие HP')
      .setDesc('Текущие очки здоровья')
      .addText(text => text
        .setPlaceholder('30')
        .setValue(this.hp.toString())
        .onChange(value => {
          this.hp = Number(value) || 0;
          this.maxHp = Math.max(this.maxHp, this.hp);
        }));

    // Max HP
    new Setting(contentEl)
      .setName('Максимальные HP')
      .setDesc('Максимальные очки здоровья')
      .addText(text => text
        .setPlaceholder('30')
        .setValue(this.maxHp.toString())
        .onChange(value => {
          this.maxHp = Number(value) || 0;
          this.hp = Math.min(this.hp, this.maxHp);
        }));

    // AC
    new Setting(contentEl)
      .setName('Класс брони (AC)')
      .setDesc('Класс брони')
      .addText(text => text
        .setPlaceholder('13')
        .setValue(this.ac.toString())
        .onChange(value => {
          this.ac = Number(value) || 10;
        }));

    // Кнопки
    new Setting(contentEl)
      .addButton(btn => btn
        .setButtonText('Добавить')
        .setCta()
        .onClick(() => {
          if (!this.name.trim()) {
            new Notice('Пожалуйста, введите имя участника');
            return;
          }

          this.parentModal.addParticipant({
            name: this.name,
            type: this.type,
            hp: this.hp,
            maxHp: this.maxHp,
            ac: this.ac
          });

          this.close();
        }))
      .addButton(btn => btn
        .setButtonText('Отмена')
        .onClick(() => {
          this.close();
        }));
  }
}

// Остальные классы остаются без изменений
class EncounterViewModal extends Modal {
  plugin: EncounterManagerPlugin;
  encounterData: Encounter;

  constructor(app: App, plugin: EncounterManagerPlugin, encounterData: Encounter) {
    super(app);
    this.plugin = plugin;
    this.encounterData = encounterData;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: this.encounterData.name });
    
    const typeBadge = contentEl.createSpan({ cls: 'encounter-type' });
    typeBadge.setText(this.plugin.getEncounterTypeLabel(this.encounterData.type));
    typeBadge.addClass(`encounter-type-${this.encounterData.type}`);
    
    // Информация об энкаунтере
    const infoSection = contentEl.createDiv({ cls: 'encounter-info' });
    infoSection.createEl('p', { text: `Тип: ${this.plugin.getEncounterTypeLabel(this.encounterData.type)}` });
    infoSection.createEl('p', { text: `Описание: ${this.encounterData.description}` });
    
    // Трекер боя для сражений
    if (this.encounterData.type === 'combat') {
      this.renderCombatTracker(contentEl);
    }
  }

  renderCombatTracker(container: HTMLElement) {
    const tracker = container.createDiv({ cls: 'combat-tracker' });
    tracker.createEl('h3', { text: 'Участники боя' });
    
    const participants = tracker.createDiv({ cls: 'participants' });
    
    this.encounterData.participants.forEach(participant => {
      const participantRow = participants.createDiv({ cls: 'combatant-row' });
      
      const infoCol = participantRow.createDiv({ cls: 'combatant-info' });
      infoCol.createEl('div', { 
        cls: 'combatant-name',
        text: `${participant.name} (${participant.type})` 
      });
      infoCol.createEl('div', { 
        cls: 'combatant-stats',
        text: `AC: ${participant.ac}` 
      });
      
      const hpCol = participantRow.createDiv({ cls: 'combatant-hp' });
      const hpBar = hpCol.createDiv({ cls: 'hp-bar' });
      const hpFill = hpBar.createDiv({ cls: 'hp-fill' });
      
      const hpPercent = (participant.hp / participant.maxHp) * 100;
      hpFill.style.width = `${hpPercent}%`;
      
      hpCol.createEl('div', { 
        cls: 'hp-text',
        text: `${participant.hp}/${participant.maxHp}` 
      });
    });
  }
}

class EncounterManagerSettingTab extends PluginSettingTab {
  plugin: EncounterManagerPlugin;

  constructor(app: App, plugin: EncounterManagerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'Encounter Manager Settings' });

    new Setting(containerEl)
      .setName('Default HP')
      .setDesc('Default hit points for new creatures')
      .addText(text => text
        .setPlaceholder('100')
        .setValue(this.plugin.settings.defaultHP.toString())
        .onChange(async (value) => {
          this.plugin.settings.defaultHP = Number(value);
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Auto-save encounters')
      .setDesc('Automatically save encounter state')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoSave)
        .onChange(async (value) => {
          this.plugin.settings.autoSave = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Encounters folder')
      .setDesc('Folder where encounter files will be created')
      .addText(text => text
        .setPlaceholder('Encounters')
        .setValue(this.plugin.settings.encountersFolder)
        .onChange(async (value) => {
          this.plugin.settings.encountersFolder = value;
          await this.plugin.saveSettings();
        }));
  }
}