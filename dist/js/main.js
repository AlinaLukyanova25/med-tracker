import { MenuManager } from "./managers/menu.js";
import { ModalManager } from "./managers/modal.js";
import { ReceptionManager } from './managers/reception.js';
import { MainPageManager } from "./managers/mainPage.js";
import { DataService } from "./core/dataService.js";
document.addEventListener('DOMContentLoaded', () => {
    const dataService = new DataService();
    const menu = new MenuManager();
    const modal = new ModalManager();
    const receptions = new ReceptionManager(modal, dataService);
    const mainPage = new MainPageManager(dataService);
});
