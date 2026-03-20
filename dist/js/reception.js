import { getElement, querySelectorEl } from "./types.js";
import { saveToStorage, loadFromStorage } from "./storage.js";
import { baseFunctions } from "./base.js";
export class ReceptionManager {
    constructor(modal) {
        this.receptions = [];
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
        this.receptions = loadFromStorage();
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.renderReceptions();
    }
    setupEventListeners() {
        console.log('Обработчик submit в reception');
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e));
        this.activeList.addEventListener('click', (e) => this.removeReceptionCard(e));
        this.timeLabel.addEventListener('click', (e) => this.handleLabelTimeClick(e));
    }
    getReceptions() {
        return this.receptions;
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
            taken: false
        };
        this.receptions.push(reception);
        this.times = [];
        console.log(this.receptions);
        saveToStorage(this.receptions);
        this.renderReceptions();
        baseFunctions.renderReceptionList(this.receptions);
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
    renderReceptions() {
        this.activeList.innerHTML = '';
        if (this.receptions.length === 0) {
            this.activeList.innerHTML = '<p class="item-title descr-not">Пока нет активных приёмов</p>';
            return;
        }
        for (let reception of this.receptions) {
            const li = this.createReceptionComponent(reception);
            this.activeList.insertAdjacentHTML('beforeend', li);
        }
    }
    createReceptionComponent(reception) {
        return `
        <li class="active__card">
            <h3 class="list-title">${reception.diseaseName}</h3>
            <h4 class="item-title">${reception.medicationName}</h4>
            <p class="active__date">
                <span class="active__date--start">Назначен: ${this.formatDateRu(reception.dateStart)}</span>
                <span class="active__date--end">Окончание приёма: ${this.formatDateRu(reception.dateEnd)}</span>
            </p>
            <div class="active__card-bottom">
                <p class="active__dosage">Доза: <span>${reception.dosage} мг.</span></p>
                <p class="active__time">Время приёма: <span>${reception.time.join(', ')}</span></p>
                <button class="item-button active__card-delete" data-id="${reception.id}">Удалить приём</button>
            </div>
        </li>
        `;
    }
    formatDateRu(date) {
        return date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
    }
    removeReceptionCard(e) {
        const target = e.target;
        const button = target.closest('.active__card-delete');
        if (!button)
            return;
        const dataId = button.getAttribute('data-id');
        if (!dataId)
            return;
        this.receptions = this.receptions.filter(reception => reception.id !== Number(dataId));
        saveToStorage(this.receptions);
        this.renderReceptions();
    }
}
