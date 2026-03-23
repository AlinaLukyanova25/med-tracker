import { DataService } from "../core/dataService.js";
import { querySelectorEl } from "../types/types.js";
import { renderArchiveList } from "../ui/renderService.js";
import { ModalManager } from "./modal.js";

export class ArchiveManager {
    private archiveList: HTMLUListElement;
    private dataService: DataService;
    private modal: ModalManager;

    constructor(dataService: DataService, modal: ModalManager) {
        this.archiveList = querySelectorEl<HTMLUListElement>('.archive__list')
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
        renderArchiveList(this.dataService.getReceptions(), this.archiveList)
    }

    setupEventListeners() {
        this.archiveList.addEventListener('click', (e) => this.handleAssignAgain(e))

        this.archiveList.addEventListener('click', (e) => this.handleRemoveArchiveCard(e))
    }

    handleAssignAgain(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.archive__btn-return')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.modal.openModalAssignAgain(dataId)
    }

    handleRemoveArchiveCard(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.archive__card-delete')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.dataService.removeReception(Number(dataId))
    }
}