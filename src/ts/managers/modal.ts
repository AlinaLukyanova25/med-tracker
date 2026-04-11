import { getElement, querySelectorEl } from "../types/types.js";
import { ModalType } from "../types/ui";
import { DataService } from "../core/dataService.js";
import { modifyChangeInputData } from "./activeList.js";
import { domElements } from "../core/domElements.js";

export class ModalManager {
    private modalForm: HTMLDivElement;
    private modalAssignAgain: HTMLDivElement;
    private modalWarning: HTMLDivElement;
    private modalWarningDescr: HTMLParagraphElement;
    private modalConfidence: HTMLDivElement;

    private dataService: DataService;

    private sectionActive = domElements.sectionActive;
    private activeList = domElements.activeList;
    private activeButton = domElements.activeButton;

    private scrollPosition = 0

    constructor(dataService: DataService) {
        this.modalForm = getElement<HTMLDivElement>('modal')
        this.modalAssignAgain = getElement<HTMLDivElement>('modal-assign-again')
        this.modalWarning = getElement<HTMLDivElement>('modal-warning')
        this.modalWarningDescr = querySelectorEl<HTMLParagraphElement>('.modal-warning__descr')
        this.modalConfidence = getElement<HTMLDivElement>('modal-confidence')
        
        this.dataService = dataService

        this.init()
    }

    init() {
        console.log('Добавляю в модал менеджер')
        document.addEventListener('click', (e) => this.handleAddButtonClick(e))
        document.addEventListener('click', (e) => this.closeModal(e))
        this.modalConfidence.addEventListener('click', (e) => this.handleClickConfidence(e))


        const myObserver = this.watchMultipleElements(
            [this.modalForm, this.modalAssignAgain, this.modalWarning, this.modalConfidence],
            'hidden',
            {
                onAdded: (el) => {
                    document.body.classList.remove('no-scroll')
                    window.scrollTo(0, this.scrollPosition)
                },
                onRemoved: (el) => document.body.classList.add('no-scroll')
            }
        );
    }

    watchMultipleElements(selectors: HTMLDivElement[], className: string, callbacks: {onAdded: (el: HTMLElement) => void, onRemoved: (el: HTMLElement) => void}) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                const element = mutation.target as HTMLElement;
                    if (element.classList.contains(className)) {
                        callbacks.onAdded?.(element);
                    } else {
                        callbacks.onRemoved?.(element);
                    }
                }
            });
        });
        
        selectors.forEach(selector => {
            observer.observe(selector, { attributes: true, attributeFilter: ['class'] });
        });

        return observer;
    }

    handleAddButtonClick(e: MouseEvent) {
        const target = e.target as HTMLElement

        const addButton: HTMLButtonElement | null = target.closest('.add-button')
        if (!addButton) return

        this.scrollPosition = e.pageY - e.clientY

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

    openModalAssignAgain(e: MouseEvent, id: string) {
        this.scrollPosition = e.pageY - e.clientY

        this.modalAssignAgain.classList.remove('hidden')
        this.modalAssignAgain.querySelector('form')?.setAttribute('data-id', id)
    }

    openModalWarning(text: string, e?: MouseEvent) {
    
        if (e) this.scrollPosition = e.pageY - e.clientY

        this.modalWarning.classList.remove('hidden')
        this.modalWarningDescr.textContent = text
    }

    openModalConfidence(e: MouseEvent, id: string) {
        this.scrollPosition = e.pageY - e.clientY

        this.modalConfidence.classList.remove('hidden')
        this.modalConfidence.setAttribute('data-id', id)
    }
}