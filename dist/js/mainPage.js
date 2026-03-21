import { querySelectorEl } from "./types.js";
import { renderReceptionList, renderStockList } from "./renderService.js";
export class MainPageManager {
    constructor(dataService) {
        this.receptionList = querySelectorEl('.reception-list');
        this.missedList = querySelectorEl('.missed-list');
        this.stockList = querySelectorEl('.stock-list');
        this.dataService = dataService;
        this.init();
    }
    init() {
        renderReceptionList(this.dataService.getReceprions(), this.receptionList, this.missedList);
        renderStockList(this.dataService.getReceprions(), this.stockList);
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.receptionList.addEventListener('click', (e) => this.handleButtonAcceptedClick(e));
        this.missedList.addEventListener('click', (e) => this.handleButtomRemoveClick(e));
    }
    handleButtonAcceptedClick(e) {
        const target = e.target;
        const button = target.closest('.reception-list__button');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        const needReception = this.dataService.getReceprions().find(r => r.id === Number(dataId));
        if (!needReception)
            return;
        needReception.taken = true;
        if (needReception.stock > 0)
            needReception.stock = needReception.stock - 1;
        this.dataService.saveLocalStorage();
        renderReceptionList(this.dataService.getReceprions(), this.receptionList, this.missedList);
        renderStockList(this.dataService.getReceprions(), this.stockList);
    }
    handleButtomRemoveClick(e) {
        const target = e.target;
        const button = target.closest('.missed-list__button');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        const needReception = this.dataService.getReceprions().find(r => r.id === Number(dataId));
        if (!needReception)
            return;
        needReception.taken = true;
        this.dataService.saveLocalStorage();
        renderReceptionList(this.dataService.getReceprions(), this.receptionList, this.missedList);
    }
}
