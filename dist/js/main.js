import { MenuManager } from "./managers/menu.js";
import { ModalManager } from "./managers/modal.js";
import { ReceptionManager } from './managers/reception.js';
import { MainPageManager } from "./managers/mainPage.js";
import { DataService } from "./core/dataService.js";
import { ArchiveManager } from "./managers/archive.js";
import { CalendarManager } from "./managers/calendar.js";
document.addEventListener('DOMContentLoaded', () => {
    const dataService = new DataService();
    const menu = new MenuManager();
    const modal = new ModalManager();
    const receptions = new ReceptionManager(modal, dataService);
    const mainPage = new MainPageManager(dataService);
    const archive = new ArchiveManager(dataService, modal);
    const calendar = new CalendarManager();
});
