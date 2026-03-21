import { MenuManager } from "./menu.js";
import { ModalManager } from "./modal.js";
import { ReceptionManager } from './reception.js';
import { MainPageManager } from "./mainPage.js";
import { DataService } from "./dataService.js";

document.addEventListener('DOMContentLoaded', () => {
    const dataService = new DataService()

    const menu = new MenuManager()

    const modal = new ModalManager()

    const receptions = new ReceptionManager(modal, dataService)

    const mainPage = new MainPageManager(dataService)
})