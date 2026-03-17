import { getElement } from "./types.js";

export class ModalManager {
    private modalForm: HTMLDivElement;

    constructor() {
        this.modalForm = getElement<HTMLDivElement>('modal')

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

    addHidden() {
        this.modalForm.classList.add('hidden')
    }

    closeModal(e: Event) {
        const target = e.target as HTMLElement
        if (target.closest('.modal') && !target.closest('.modal__content') || target.closest('.modal__close')) {
            this.modalForm.classList.add('hidden')
        }
    }
}