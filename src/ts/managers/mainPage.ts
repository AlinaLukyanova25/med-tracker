import { querySelectorEl } from "../types/types.js";
import { renderReceptionList, renderStockList } from "../ui/renderService.js";
import { DataService } from "../core/dataService.js";

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
        this.setupEventListeners()

        this.dataService.subscribe(() => {
            this.render()
        })

        this.render()
    }

    render() {
        renderReceptionList(this.dataService.getReceptions(), this.receptionList, this.missedList)
        renderStockList(this.dataService.getReceptions(), this.stockList)
    }

    setupEventListeners() {
        this.receptionList.addEventListener('click', (e) => this.handleButtonAcceptedClick(e))

        this.missedList.addEventListener('click', (e) => this.handleButtonRemoveClick(e))
    }

    handleButtonAcceptedClick(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.reception-list__button')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.dataService.updateReception(Number(dataId), (rec) => {
            rec.taken = true;
            rec.stock -= (rec.stock > 0) ? 1 : 0;
        })
    }

    handleButtonRemoveClick(e: Event) {
        const target = e.target as HTMLElement

        const button = target.closest('.missed-list__button')
        if (!button) return

        const dataId = button.getAttribute('data-id')
        if (!dataId) return

        this.dataService.updateReception(Number(dataId), (rec) => {
            rec.taken = true
        })
    }

}