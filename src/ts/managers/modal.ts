import { getElement, querySelectorEl } from "../types/types.js";
import { ModalType } from "../types/common";
import { DataService } from "../core/dataService.js";
import { modifyChangeInputData } from "./activeList.js";

export class ModalManager {
    private modalForm: HTMLDivElement;
    private modalAssignAgain: HTMLDivElement;
    private modalWarning: HTMLDivElement;
    private modalWarningDescr: HTMLParagraphElement;
    private modalConfidence: HTMLDivElement;
    private dataService: DataService;

    private sectionActive: HTMLElement;
    private activeList: HTMLUListElement;
    private activeButton: HTMLButtonElement;

    constructor(dataService: DataService) {
        this.modalForm = getElement<HTMLDivElement>('modal')
        this.modalAssignAgain = getElement<HTMLDivElement>('modal-assign-again')
        this.modalWarning = getElement<HTMLDivElement>('modal-warning')
        this.modalWarningDescr = querySelectorEl<HTMLParagraphElement>('.modal-warning__descr')
        this.modalConfidence = getElement<HTMLDivElement>('modal-confidence')
        this.dataService = dataService

        this.sectionActive = querySelectorEl<HTMLElement>('.active');
        this.activeList = querySelectorEl<HTMLUListElement>('.active__list');
        this.activeButton = querySelectorEl<HTMLButtonElement>('.active__button')

        this.init()
    }

    init() {
        console.log('Добавляю в модал менеджер')
        document.addEventListener('click', (e) => this.handleAddButtonClick(e))
        document.addEventListener('click', (e) => this.closeModal(e))
        this.modalConfidence.addEventListener('click', (e) => this.handleClickConfidence(e))
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

        if (
            target.closest('.modal-warning') && !target.closest('.modal-warning__content') || target.closest('.modal-warning__close')
        ) {
            this.modalWarning.classList.add('hidden')
        }

        if (
            target.closest('.modal-confidence') && !target.closest('.modal-confidence__content') || target.closest('.modal-confidence__close')
        ) {
            this.modalConfidence.classList.add('hidden')
        }
    }

    handleClickConfidence(e: Event) {
        const target = e.target as HTMLElement

        if (target.closest('#ok')) {
            const id = this.modalConfidence.getAttribute('data-id')
            if (!id) return

            this.dataService.removeDiseases(Number(id))
            this.modalConfidence.classList.add('hidden')

            if (this.sectionActive.querySelector('.edit')) {
                modifyChangeInputData(true)
                this.sectionActive.querySelector('.edit')?.remove()
                this.activeList.style.display = 'flex'
                this.activeButton.style.display = 'block'
            }

            return
        } 
        if (target.closest('#no')) {
            this.modalConfidence.classList.add('hidden')
        }
    }

    openModalAssignAgain(id: string) {
        this.modalAssignAgain.classList.remove('hidden')
        this.modalAssignAgain.querySelector('form')?.setAttribute('data-id', id)
    }

    openModalWarning(text: string) {
        this.modalWarning.classList.remove('hidden')
        this.modalWarningDescr.textContent = text
    }

    openModalConfidence(id: string) {
        this.modalConfidence.classList.remove('hidden')
        this.modalConfidence.setAttribute('data-id', id)
    }
}