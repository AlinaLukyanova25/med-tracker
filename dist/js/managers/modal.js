import { getElement, querySelectorEl } from "../types/types.js";
import { modifyChangeInputData } from "./activeList.js";
export class ModalManager {
    constructor(dataService) {
        this.modalForm = getElement('modal');
        this.modalAssignAgain = getElement('modal-assign-again');
        this.modalWarning = getElement('modal-warning');
        this.modalWarningDescr = querySelectorEl('.modal-warning__descr');
        this.modalConfidence = getElement('modal-confidence');
        this.dataService = dataService;
        this.sectionActive = querySelectorEl('.active');
        this.activeList = querySelectorEl('.active__list');
        this.activeButton = querySelectorEl('.active__button');
        this.init();
    }
    init() {
        console.log('Добавляю в модал менеджер');
        document.addEventListener('click', (e) => this.handleAddButtonClick(e));
        document.addEventListener('click', (e) => this.closeModal(e));
        this.modalConfidence.addEventListener('click', (e) => this.handleClickConfidence(e));
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
        if (target.closest('.modal-confidence') && !target.closest('.modal-confidence__content') || target.closest('.modal-confidence__close')) {
            this.modalConfidence.classList.add('hidden');
        }
    }
    handleClickConfidence(e) {
        var _a;
        const target = e.target;
        if (target.closest('#ok')) {
            const id = this.modalConfidence.getAttribute('data-id');
            if (!id)
                return;
            this.dataService.removeDiseases(Number(id));
            this.modalConfidence.classList.add('hidden');
            if (this.sectionActive.querySelector('.edit')) {
                modifyChangeInputData(true);
                (_a = this.sectionActive.querySelector('.edit')) === null || _a === void 0 ? void 0 : _a.remove();
                this.activeList.style.display = 'flex';
                this.activeButton.style.display = 'block';
            }
            return;
        }
        if (target.closest('#no')) {
            this.modalConfidence.classList.add('hidden');
        }
    }
    openModalAssignAgain(id) {
        var _a;
        this.modalAssignAgain.classList.remove('hidden');
        (_a = this.modalAssignAgain.querySelector('form')) === null || _a === void 0 ? void 0 : _a.setAttribute('data-id', id);
    }
    openModalWarning(text) {
        this.modalWarning.classList.remove('hidden');
        this.modalWarningDescr.textContent = text;
    }
    openModalConfidence(id) {
        this.modalConfidence.classList.remove('hidden');
        this.modalConfidence.setAttribute('data-id', id);
    }
}
