import { getElement, querySelectorEl } from "../types/types.js";
import { renderActiveList } from "../ui/renderService.js";
export class ReceptionManager {
    constructor(modal, dataService) {
        this.times = [];
        this.activeList = querySelectorEl('.active__list');
        this.addForm = getElement('add-reception');
        this.diseaseName = getElement('disease-name');
        this.medicationName = getElement('medication-name');
        this.time = getElement('reception-time');
        this.timeLabel = getElement('time-label');
        this.dosage = getElement('reception-dosage');
        this.stock = getElement('reception-stock');
        this.dateEnd = getElement('reception-end');
        this.modal = modal;
        this.dataService = dataService;
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
        renderActiveList(this.dataService.getReceptions(), this.activeList);
    }
    setupEventListeners() {
        console.log('Обработчик submit в reception');
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e));
        this.activeList.addEventListener('click', (e) => this.removeReceptionCard(e));
        this.timeLabel.addEventListener('click', (e) => this.handleLabelTimeClick(e));
    }
    handleAddFormSubmit(e) {
        var _a;
        e.preventDefault();
        const disName = this.diseaseName.value.trim();
        const medName = this.medicationName.value.trim();
        const dosage = Number(this.dosage.value);
        const stock = Number(this.stock.value);
        const dateEnd = new Date((_a = this.dateEnd) === null || _a === void 0 ? void 0 : _a.value);
        const time = this.time.value;
        if (!disName || !medName) {
            alert('Введите корректные названия');
            return;
        }
        if (isNaN(dateEnd.getTime())) {
            alert('Укажите корректную дату окончания');
            return;
        }
        if (!time && this.times.length === 0) {
            alert('Введите время приёма');
            return;
        }
        if (time)
            this.times.push(time);
        const reception = {
            id: Date.now(),
            diseaseName: disName,
            medicationName: medName,
            time: this.times,
            dosage: dosage,
            stock: stock,
            dateStart: new Date(),
            dateEnd: dateEnd,
            taken: false,
            lastTakenUpdate: new Date().toISOString()
        };
        this.dataService.addReception(reception);
        this.times = [];
        this.modal.addHidden();
        this.addForm.reset();
    }
    handleLabelTimeClick(e) {
        const target = e.target;
        const addMore = target.closest('.modal__add-more');
        if (!addMore)
            return;
        if (!this.time.value)
            return;
        alert(this.time.value);
        this.times.push(this.time.value);
        console.log(this.times);
        this.time.value = '';
    }
    removeReceptionCard(e) {
        const target = e.target;
        const button = target.closest('.active__card-delete');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        this.dataService.removeReception(Number(dataId));
    }
}
