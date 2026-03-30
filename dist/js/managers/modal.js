import { getElement } from "../types/types.js";
export class ModalManager {
    constructor() {
        this.modalForm = getElement('modal');
        this.modalAssignAgain = getElement('modal-assign-again');
        this.modalWarning = getElement('modal-warning');
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
    addHidden(modal) {
        if (modal === 'modal')
            this.modalForm.classList.add('hidden');
        if (modal === 'again')
            this.modalAssignAgain.classList.add('hidden');
    }
    closeModal(e) {
        const target = e.target;
        if (target.closest('.modal') && !target.closest('.modal__content') || target.closest('.modal__close')) {
            this.modalForm.classList.add('hidden');
        }
        if (target.closest('.modal-assign-again') && !target.closest('.modal-assign-again__content') || target.closest('.modal-again__close')) {
            this.modalAssignAgain.classList.add('hidden');
        }
        if (target.closest('.modal-warning') && !target.closest('.modal-warning__content') || target.closest('.modal-warning__close')) {
            this.modalWarning.classList.add('hidden');
        }
    }
    openModalAssignAgain(id) {
        var _a;
        this.modalAssignAgain.classList.remove('hidden');
        (_a = this.modalAssignAgain.querySelector('form')) === null || _a === void 0 ? void 0 : _a.setAttribute('data-id', id);
    }
    openModalWarning() {
        this.modalWarning.classList.remove('hidden');
    }
}
