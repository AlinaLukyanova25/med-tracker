import { ModalType } from "../types/ui";
import { DataService } from "../core/dataService.js";
import { modifyChangeInputData } from "./activeList.js";
import { domElements } from "../core/domElements.js";

export class ModalManager {
    private modalForm: HTMLDivElement = domElements.modal.modalForm;
    private modalAssignAgain: HTMLDivElement = domElements.modal.modalAssignAgain;
    private modalWarning: HTMLDivElement = domElements.modal.modalWarning;
    private modalWarningDescr: HTMLParagraphElement = domElements.modal.modalWarningDescr;
    private modalConfidence: HTMLDivElement = domElements.modal.modalConfidence;
    private modalFormClose: HTMLSpanElement = domElements.modal.modalFormClose;
    private modalAgainClose: HTMLSpanElement = domElements.modal.modalAgainClose
    private modalWarningClose: HTMLSpanElement = domElements.modal.modalWarningClose
    private modalConfidenceClose: HTMLSpanElement = domElements.modal.modalConfidenceClose
    

    private dataService: DataService;

    private sectionActive = domElements.sectionActive;
    private activeList = domElements.activeList;
    private activeButton = domElements.activeButton;

    private focusElement: HTMLElement | null = null

    private scrollPosition = 0

    constructor(dataService: DataService) {
        
        this.dataService = dataService

        this.init()
    }

    init() {
        document.addEventListener('click', (e) => this.handleAddButtonClick(e))
        document.addEventListener('click', (e) => this.handleCloseModal(e))
        this.modalConfidence.addEventListener('click', (e) => this.handleClickConfidence(e))


        const myObserver = this.watchMultipleElements(
            [this.modalForm, this.modalAssignAgain, this.modalWarning, this.modalConfidence],
            'hidden',
            {
                onAdded: (el) => {
                    document.body.classList.remove('no-scroll')
                    window.scrollTo(0, this.scrollPosition)

                    setTimeout(() => {
                        if (this.focusElement) this.focusElement.focus()
                
                        this.focusElement = null
                    }, 10)
                },
                onRemoved: (el) => document.body.classList.add('no-scroll')
            }
        );
    }

    watchMultipleElements(selectors: HTMLDivElement[], className: string, callbacks: {onAdded: (el: HTMLElement) => void, onRemoved: (el: HTMLElement) => void}) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    const element = mutation.target;
                    
                    if (!(element instanceof HTMLElement)) return

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
        const target = e.target

        if (!(target instanceof HTMLElement)) return

        const addButton= target.closest('.add-button')
        if (!(addButton instanceof HTMLButtonElement)) return

        this.modalFormClose.focus()
        this.focusElement = addButton

        this.scrollPosition = e.pageY - e.clientY

        this.modalForm.classList.remove('hidden')
        this.modalForm.focus()
    }

    addHidden(modal: ModalType) {
        if (modal === 'modal') this.modalForm.classList.add('hidden')
        if (modal === 'again') this.modalAssignAgain.classList.add('hidden')
    }

    handleCloseModal(e: MouseEvent) {
        const target = e.target

        if (!(target instanceof HTMLElement)) return
        
        this.closeModal(target)
    }

    closeModal(target: HTMLElement) {
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

    handleClickConfidence(e: MouseEvent) {
        const target = e.target

        if (!(target instanceof HTMLElement)) return

        if (target.closest('#ok')) {
            const id = this.modalConfidence.getAttribute('data-id')
            if (!id) return

            this.dataService.removeDiseases(Number(id))
            this.modalConfidence.classList.add('hidden')

            if (this.sectionActive.style.display !== 'none' &&
                this.sectionActive.querySelector('.edit')) {
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

    openModalAssignAgain(e: MouseEvent, id: string, button: HTMLElement) {
        this.scrollPosition = e.pageY - e.clientY

        if (button) {
            this.focusElement = button
        }

        this.modalAssignAgain.classList.remove('hidden')
        this.modalAssignAgain.querySelector('form')?.setAttribute('data-id', id)

        this.modalAgainClose.focus()
    }

    openModalWarning(text: string, e?: MouseEvent, button?: HTMLElement) {
    
        if (e) {
            this.scrollPosition = e.pageY - e.clientY
        }

        if (button) {
            this.focusElement = button
        }

        this.modalWarning.classList.remove('hidden')
        this.modalWarningDescr.textContent = text
        this.modalWarning.focus()

    }

    openModalConfidence(e: MouseEvent, id: string, button: HTMLButtonElement) {
        this.scrollPosition = e.pageY - e.clientY

        this.focusElement = button

        this.modalConfidence.classList.remove('hidden')
        this.modalConfidence.setAttribute('data-id', id)

        this.modalConfidenceClose.focus()
    }
}