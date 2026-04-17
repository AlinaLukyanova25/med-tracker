import { querySelectorEl } from '../types/types.js';
import { renderReceptionList, renderStockList } from '../ui/renderService.js';
import { checkRecedptionTime } from '../core/dateUtils.js';
import { domElements } from '../core/domElements.js';
export class MainPageManager {
    constructor(dataService, modal, activeList) {
        this.mainPage = domElements.mainPage;
        this.receptionList = domElements.receptionList;
        this.missedList = domElements.missedList;
        this.stockList = domElements.stockList;
        this.dataService = dataService;
        this.modal = modal;
        this.activeList = activeList;
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
        this.receptionList.addEventListener('click', (e) => this.handleButtonAcceptedClick(e, 'reception-list__button'));
        this.receptionList.addEventListener('click', (e) => this.openHiddenCards(e, 'reception-list__open-card', 'reception-list__card-hidden'));
        this.missedList.addEventListener('click', (e) => this.handleButtonAcceptedClick(e, 'missed-list__button--check'));
        this.missedList.addEventListener('click', (e) => this.handleButtonRemoveClick(e));
        this.missedList.addEventListener('click', (e) => this.openHiddenCards(e, 'missed-list__open-card', 'missed-list__card-hidden'));
        this.stockList.addEventListener('click', (e) => this.openHiddenCards(e, 'stock-list__open-card', 'stock-list__card-hidden'));
        this.stockList.addEventListener('click', (e) => this.handleClickReplenish(e));
    }
    handleButtonAcceptedClick(e, classButton) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest(`.${classButton}`);
        if (!(button instanceof HTMLButtonElement))
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        const time = button.getAttribute('data-time');
        if (!time)
            return;
        if (classButton === 'reception-list__button') {
            const passedFifteenMinutes = checkRecedptionTime(time);
            if (passedFifteenMinutes) {
                this.dataService.updateMedication(dataId, (med) => {
                    if (!med.takenTimes.includes(time)) {
                        med.takenTimes.push(time);
                    }
                    if ((med.type === 'Таблетка' ||
                        med.type === 'Капсула' ||
                        (med.type === 'Порошок' && med.dosageType === 'Пакетик')) &&
                        med.stock !== undefined) {
                        med.stock -=
                            med.stock > 0 && med.stock - med.dosage > 0 ? med.dosage : 0;
                    }
                });
            }
            else {
                this.modal.openModalWarning('Слишком рано для приёма лекарства!', e, button);
            }
        }
        else {
            this.dataService.updateMedication(dataId, (med) => {
                if (!med.takenTimes.includes(time)) {
                    med.takenTimes.push(time);
                }
                if ((med.type === 'Таблетка' ||
                    med.type === 'Капсула' ||
                    (med.type === 'Порошок' && med.dosageType === 'Пакетик')) &&
                    med.stock !== undefined) {
                    med.stock -=
                        med.stock > 0 && med.stock - med.dosage >= 0 ? med.dosage : 0;
                }
            });
        }
    }
    handleButtonRemoveClick(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest('.missed-list__button');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        const time = button.getAttribute('data-time');
        if (!time)
            return;
        this.dataService.updateMedication(dataId, (med) => {
            if (!med.takenTimes.includes(time)) {
                med.takenTimes.push(time);
            }
        });
    }
    openHiddenCards(e, buttonClass, divClass) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest(`.${buttonClass}`);
        if (!(button instanceof HTMLButtonElement))
            return;
        const div = querySelectorEl(`.${divClass}`, HTMLDivElement);
        const isOpen = div.style.display === 'none';
        if (isOpen) {
            div.style.display = 'block';
            button.textContent = `Скрыть остальные (${div.querySelectorAll('li').length})`;
            button.classList.add('colorLight');
        }
        else {
            div.style.display = 'none';
            button.textContent = `Показать остальные (${div.querySelectorAll('li').length})`;
            button.classList.remove('colorLight');
        }
    }
    handleClickReplenish(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest('.stock-list__button');
        if (!button)
            return;
        const id = button.getAttribute('data-id');
        if (!id)
            return;
        const dis = this.dataService.findDiseaseWithMed(id);
        if (!dis)
            return;
        this.mainPage.style.display = 'none';
        this.activeList.openEditCard(dis);
    }
}
