import { querySelectorEl } from "../types/types.js";
import { renderReceptionList, renderStockList } from "../ui/renderService.js";
import { checkRecedptionTime } from "../core/timeUtils.js";
export class MainPageManager {
    constructor(dataService, modal) {
        this.receptionList = querySelectorEl('.reception-list');
        this.missedList = querySelectorEl('.missed-list');
        this.stockList = querySelectorEl('.stock-list');
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
        renderReceptionList(this.dataService.getDiseases(), this.receptionList, this.missedList, this.dataService.getAllMedications());
        renderStockList(this.dataService.getDiseases(), this.stockList, this.dataService.getAllMedications());
    }
    setupEventListeners() {
        this.receptionList.addEventListener('click', (e) => this.handleButtonAcceptedClick(e));
        this.missedList.addEventListener('click', (e) => this.handleButtonRemoveClick(e));
    }
    handleButtonAcceptedClick(e) {
        const target = e.target;
        const button = target.closest('.reception-list__button');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        const time = button.getAttribute('data-time');
        if (!time)
            return;
        const passedFifteenMinutes = checkRecedptionTime(time);
        console.log(passedFifteenMinutes);
        if (passedFifteenMinutes) {
            this.dataService.updateDisease(dataId, (med) => {
                if (!med.takenTimes.includes(time)) {
                    med.takenTimes.push(time);
                }
                med.stock -= (med.stock > 0) ? 1 : 0;
            });
        }
        else {
            this.modal.openModalWarning();
        }
    }
    handleButtonRemoveClick(e) {
        const target = e.target;
        const button = target.closest('.missed-list__button');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        const time = button.getAttribute('data-time');
        if (!time)
            return;
        this.dataService.updateDisease(dataId, (med) => {
            if (!med.takenTimes.includes(time)) {
                med.takenTimes.push(time);
            }
        });
    }
}
