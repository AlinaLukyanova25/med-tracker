import { domElements } from '../core/domElements.js';
import { renderArchiveList } from '../ui/renderService.js';
export class ArchiveManager {
    constructor(dataService, modal) {
        this.archiveList = domElements.archiveList;
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
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest('.archive__btn-return');
        if (!(button instanceof HTMLButtonElement))
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        this.modal.openModalAssignAgain(e, dataId, button);
    }
    handleRemoveArchiveCard(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest('.archive__card-delete');
        if (!(button instanceof HTMLButtonElement))
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        this.modal.openModalConfidence(e, dataId, button);
    }
}
