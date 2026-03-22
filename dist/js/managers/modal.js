import { getElement } from "../types/types.js";
export class ModalManager {
    constructor() {
        this.modalForm = getElement('modal');
        this.init();
    }
    init() {
        console.log('Добавляю в модал менеджер');
        document.addEventListener('click', (e) => this.handleAddButtonClick(e));
        document.addEventListener('click', (e) => this.closeModal(e));
    }
    handleAddButtonClick(e) {
        const target = e.target;
        const addButton = target.closest('.add-button');
        if (!addButton)
            return;
        this.modalForm.classList.remove('hidden');
    }
    addHidden() {
        this.modalForm.classList.add('hidden');
    }
    closeModal(e) {
        const target = e.target;
        if (target.closest('.modal') && !target.closest('.modal__content') || target.closest('.modal__close')) {
            this.modalForm.classList.add('hidden');
        }
    }
}
