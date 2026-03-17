import { getElement, querySelectorEl } from "./types.js";
export class ReceptionManager {
    constructor(modal) {
        this.receptions = [];
        this.activeList = querySelectorEl('.active__list');
        this.addForm = getElement('add-reception');
        this.diseaseName = getElement('disease-name');
        this.medicationName = getElement('medication-name');
        this.dosage = getElement('reception-dosage');
        this.stock = getElement('reception-stock');
        this.dateEnd = getElement('reception-end');
        this.modal = modal;
        this.init();
    }
    init() {
        this.setupEventListeners();
    }
    setupEventListeners() {
        console.log('Обработчик submit в reception');
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e));
    }
    handleAddFormSubmit(e) {
        var _a;
        e.preventDefault();
        const disName = this.diseaseName.value.trim();
        const medName = this.medicationName.value.trim();
        const dosage = Number(this.dosage.value);
        const stock = Number(this.stock.value);
        const dateEnd = new Date((_a = this.dateEnd) === null || _a === void 0 ? void 0 : _a.value);
        if (!disName || !medName) {
            alert('Введите корректные названия');
            return;
        }
        if (isNaN(dateEnd.getTime())) {
            alert('Укажите корректную дату окончания');
            return;
        }
        const reception = {
            diseaseName: disName,
            medicationName: medName,
            dosage: dosage,
            stock: stock,
            dateStart: new Date(),
            dateEnd: dateEnd
        };
        this.receptions.push(reception);
        console.log(this.receptions);
        this.renderReceptions();
        this.modal.addHidden();
        this.addForm.reset();
    }
    renderReceptions() {
        this.activeList.innerHTML = '';
        if (this.receptions.length === 0)
            return;
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
                <p class="active__time">Время приёма: <span>Утро</span></p>
                <button class="item-button active__card-delete">Удалить приём</button>
            </div>
        </li>
        `;
    }
    formatDateRu(date) {
        return date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
    }
}
