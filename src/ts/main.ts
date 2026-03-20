import { MenuManager } from "./menu.js";
import { ModalManager } from "./modal.js";
import { ReceptionManager } from './reception.js';
import { MainPageManager } from "./mainPage.js";

document.addEventListener('DOMContentLoaded', () => {
    const menu = new MenuManager()

    const modal = new ModalManager()

    const receptions = new ReceptionManager(modal)

    const mainPage = new MainPageManager(receptions)
})