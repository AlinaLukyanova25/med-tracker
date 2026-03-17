import { MenuManager } from "./menu.js";
import { ModalManager } from "./modal.js";
import { ReceptionManager } from './reception.js'

document.addEventListener('DOMContentLoaded', () => {
    const menu = new MenuManager()

    const modal = new ModalManager()

    const receptions = new ReceptionManager(modal)
})