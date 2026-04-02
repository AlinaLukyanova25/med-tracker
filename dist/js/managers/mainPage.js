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
        this.receptionList.addEventListener('click', (e) => this.openHiddenCards(e, 'reception-list__open-card', 'reception-list__card-hidden'));
        this.missedList.addEventListener('click', (e) => this.handleButtonRemoveClick(e));
        this.missedList.addEventListener('click', (e) => this.openHiddenCards(e, 'missed-list__open-card', 'missed-list__card-hidden'));
        this.stockList.addEventListener('click', (e) => this.openHiddenCards(e, 'stock-list__open-card', 'stock-list__card-hidden'));
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
    openHiddenCards(e, buttonClass, divClass) {
        const target = e.target;
        const button = target.closest(`.${buttonClass}`);
        if (!button)
            return;
        const div = querySelectorEl(`.${divClass}`);
        const isOpen = div.style.display === 'none';
        if (isOpen) {
            div.style.display = 'block';
            button.textContent = `Скрыть остальные (${div.querySelectorAll('li').length}) 🔝`;
            button.classList.add('colorLight');
        }
        else {
            div.style.display = 'none';
            button.textContent = `Показать остальные (${div.querySelectorAll('li').length}) 🔽`;
            button.classList.remove('colorLight');
        }
    }
}
