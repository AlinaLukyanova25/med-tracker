import { MenuManager } from "./managers/menu.js";
import { ModalManager } from "./managers/modal.js";
import { DiseasesManager } from './managers/diseases.js';
import { MainPageManager } from "./managers/mainPage.js";
import { DataService } from "./core/dataService.js";
import { ArchiveManager } from "./managers/archive.js";
import { CalendarManager } from "./managers/calendar.js";
import { ActiveListManager } from "./managers/activeList.js";
document.addEventListener('DOMContentLoaded', () => {
    const dataService = new DataService();
    const menu = new MenuManager();
    const modal = new ModalManager(dataService);
    const diseases = new DiseasesManager(modal, dataService);
    const mainPage = new MainPageManager(dataService, modal);
    const archive = new ArchiveManager(dataService, modal);
    const calendar = new CalendarManager(dataService, modal);
    const activeList = new ActiveListManager(dataService, modal);
});
