import { DataService } from "../core/dataService.js";
import { domElements } from "../core/domElements.js";
import { renderArchiveList } from "../ui/renderService.js";
import { ModalManager } from "./modal.js";

export class ArchiveManager {
    private archiveList: HTMLUListElement = domElements.archiveList;
    private dataService: DataService;
    private modal: ModalManager;

    constructor(dataService: DataService, modal: ModalManager) {
        
        this.dataService = dataService
        this.modal = modal

        this.init()
    }

    init() {
        this.setupEventListeners()

        this.dataService.subscribe(() => {
            this.render()
        })

        this.render()
    }

    render() {
        renderArchiveList(this.dataService.getDiseases(), this.archiveList)
    }

    setupEventListeners() {
        this.archiveList.addEventListener('click', (e) => this.handleAssignAgain(e))

        this.archiveList.addEventListener('click', (e) => this.handleRemoveArchiveCard(e))
    }

    handleAssignAgain(e: MouseEvent) {
        const target = e.target

        if (!(target instanceof HTMLElement)) return

        const button = target.closest('.archive__btn-return')
        if (!(button instanceof HTMLButtonElement)) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.modal.openModalAssignAgain(e, dataId, button)
    }

    handleRemoveArchiveCard(e: MouseEvent) {
        const target = e.target

        if (!(target instanceof HTMLElement)) return

        const button = target.closest('.archive__card-delete')
        if (!(button instanceof HTMLButtonElement)) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.modal.openModalConfidence(e, dataId, button)
    }
}