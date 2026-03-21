import { querySelectorEl, Reception } from "./types.js";
import { renderReceptionList, renderStockList } from "./renderService.js";
import { DataService } from "./dataService.js";

export class MainPageManager {
    private receptionList: HTMLUListElement;
    private missedList: HTMLUListElement;
    private dataService: DataService;
    private stockList: HTMLUListElement

    constructor(dataService: DataService) {
        this.receptionList = querySelectorEl<HTMLUListElement>('.reception-list');
        this.missedList = querySelectorEl<HTMLUListElement>('.missed-list');
        this.stockList = querySelectorEl<HTMLUListElement>('.stock-list')
        this.dataService = dataService

        this.init()
    }

    init() {
        renderReceptionList(this.dataService.getReceprions(), this.receptionList, this.missedList)
        renderStockList(this.dataService.getReceprions(), this.stockList)

        this.setupEventListeners()
    }

    setupEventListeners() {
        this.receptionList.addEventListener('click', (e) => this.handleButtonAcceptedClick(e))

        this.missedList.addEventListener('click', (e) => this.handleButtomRemoveClick(e))
    }

    handleButtonAcceptedClick(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.reception-list__button')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        const needReception = this.dataService.getReceprions().find(r => r.id === Number(dataId))
        if (!needReception) return
        needReception.taken = true
        if (needReception.stock > 0) needReception.stock = needReception.stock - 1

        this.dataService.saveLocalStorage()

        renderReceptionList(this.dataService.getReceprions(), this.receptionList, this.missedList)
        renderStockList(this.dataService.getReceprions(), this.stockList)
    }

    handleButtomRemoveClick(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.missed-list__button')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        const needReception = this.dataService.getReceprions().find(r => r.id === Number(dataId))
        if (!needReception) return
        needReception.taken = true

        this.dataService.saveLocalStorage()

        renderReceptionList(this.dataService.getReceprions(), this.receptionList, this.missedList)
    }

}