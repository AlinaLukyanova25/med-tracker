import { getElement } from "../types/types.js";
import { ModalType } from "../types/common";

export class ModalManager {
    private modalForm: HTMLDivElement;
    private modalAssignAgain: HTMLDivElement;
    private modalWarning: HTMLDivElement;

    constructor() {
        this.modalForm = getElement<HTMLDivElement>('modal')
        this.modalAssignAgain = getElement<HTMLDivElement>('modal-assign-again')
        this.modalWarning = getElement<HTMLDivElement>('modal-warning')

        this.init()
    }

    init() {
        console.log('Добавляю в модал менеджер')
        document.addEventListener('click', (e) => this.handleAddButtonClick(e))
        document.addEventListener('click', (e) => this.closeModal(e))
    }

    handleAddButtonClick(e: Event) {
        const target = e.target as HTMLElement

        const addButton: HTMLButtonElement | null = target.closest('.add-button')
        if (!addButton) return

        this.modalForm.classList.remove('hidden')
    }

    addHidden(modal: ModalType) {
        if (modal === 'modal') this.modalForm.classList.add('hidden')
        if (modal === 'again') this.modalAssignAgain.classList.add('hidden')
    }

    closeModal(e: Event) {
        const target = e.target as HTMLElement
        if (target.closest('.modal') && !target.closest('.modal__content') || target.closest('.modal__close')) {
            this.modalForm.classList.add('hidden')
        }
        if (target.closest('.modal-assign-again') && !target.closest('.modal-assign-again__content') || target.closest('.modal-again__close')) {
            this.modalAssignAgain.classList.add('hidden')
        }
        if (target.closest('.modal-warning') && !target.closest('.modal-warning__content') || target.closest('.modal-warning__close')) {
            this.modalWarning.classList.add('hidden')
        }
    }

    openModalAssignAgain(id: string) {
        this.modalAssignAgain.classList.remove('hidden')
        this.modalAssignAgain.querySelector('form')?.setAttribute('data-id', id)
    }

    openModalWarning() {
        this.modalWarning.classList.remove('hidden')
    }
}