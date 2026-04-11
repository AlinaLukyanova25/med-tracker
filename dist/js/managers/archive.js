import { querySelectorEl } from "../types/types.js";
import { renderArchiveList } from "../ui/renderService.js";
export class ArchiveManager {
    constructor(dataService, modal) {
        this.archiveList = querySelectorEl('.archive__list');
        this.dataService = dataService;
        this.modal = modal;
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.dataService.subscribe(() => {
            this.render();
        });
        this.render();
    }
    render() {
        renderArchiveList(this.dataService.getDiseases(), this.archiveList);
    }
    setupEventListeners() {
        this.archiveList.addEventListener('click', (e) => this.handleAssignAgain(e));
        this.archiveList.addEventListener('click', (e) => this.handleRemoveArchiveCard(e));
    }
    handleAssignAgain(e) {
        const target = e.target;
        const button = target.closest('.archive__btn-return');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        this.modal.openModalAssignAgain(e, dataId);
    }
    handleRemoveArchiveCard(e) {
        const target = e.target;
        const button = target.closest('.archive__card-delete');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        this.dataService.removeDiseases(Number(dataId));
    }
}
