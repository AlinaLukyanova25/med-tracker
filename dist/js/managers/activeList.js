import { DiseaseEditType, isValidDiseaseEditKey, isValidMedicationKey, MedicationEditType, querySelectorEl } from "../types/types.js";
import { formatDateRu, isDosageType, parseRussianDate } from "../core/timeUtils.js";
export class ActiveListManager {
    constructor(dataService, modal) {
        this.toggleMedication = false;
        this.changeInputData = [];
        this.sectionActive = querySelectorEl('.active');
        this.activeList = querySelectorEl('.active__list');
        this.activeButton = querySelectorEl('.active__button');
        this.dataService = dataService;
        this.modal = modal;
        this.init();
    }
    init() {
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.activeList.addEventListener('click', (e) => this.handleMedicationOpen(e));
        this.activeList.addEventListener('click', (e) => this.handleRemoveDiseaseCard(e));
        this.activeList.addEventListener('click', (e) => this.handleRemoveMedication(e));
        this.activeList.addEventListener('click', (e) => this.handleClickForEdit(e));
        this.sectionActive.addEventListener('change', (e) => this.pendingChanges(e));
        document.addEventListener('click', (e) => this.handleSaveEdit(e));
        document.addEventListener('click', (e) => this.handleComeBack(e));
    }
    pendingChanges(e) {
        const target = e.target;
        const input = target.closest('input');
        if (!input)
            return;
        if (!input.value.trim()) {
            this.modal.openModalWarning('Введите правильное значение');
            return;
        }
        const property = input.getAttribute('data-property');
        const id = input.getAttribute('data-object-id');
        const typeofId = input.getAttribute('data-typeof-id');
        if (!property || !id || !typeofId || (typeofId !== 'string' && typeofId !== 'number'))
            return;
        if (property === 'dateStart' || property === 'dateEnd') {
            const newValue = parseRussianDate(input.value, property, id, this.modal);
            if (!newValue)
                return;
            this.handleInputChange(property, id, typeofId, newValue);
            return;
        }
        else if (property === 'dosage') {
            if (Number(input.value) < 0) {
                this.modal.openModalWarning('Введите корректные значения');
                return;
            }
            this.handleInputChange(property, id, typeofId, Number(input.value));
            return;
        }
        else if (property === 'stock') {
            if (Number(input.value) < 1) {
                this.modal.openModalWarning('Введите корректные значения');
                return;
            }
            this.handleInputChange(property, id, typeofId, Number(input.value));
            return;
        }
        else if (property === 'time') {
            const times = input.value.split(', ');
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!(times.every(t => timeRegex.test(t)))) {
                this.modal.openModalWarning('Введите корректные данные');
                return;
            }
        }
        this.handleInputChange(property, id, typeofId, input.value);
    }
    handleInputChange(property, id, typeofId, newValue) {
        let changeInput;
        if (typeofId === 'number' && isValidDiseaseEditKey(property)) {
            changeInput = {
                property: DiseaseEditType[property],
                id,
                typeofId,
                newValue
            };
        }
        else if (typeofId === 'string' && isValidMedicationKey(property)) {
            changeInput = {
                property: MedicationEditType[property],
                id,
                typeofId,
                newValue
            };
        }
        else {
            this.modal.openModalWarning('Недопустимое поле для болезни');
            return;
        }
        this.changeInputData.push(changeInput);
    }
    handleSaveEdit(e) {
        var _a;
        const target = e.target;
        const button = target.closest('.edit__save-btn');
        if (!button)
            return;
        console.log(this.changeInputData);
        for (let data of this.changeInputData) {
            if (data.typeofId === 'number') {
                const key = data.property;
                this.dataService.updateDisease(Number(data.id), (dis) => {
                    switch (key) {
                        case 'dateStart':
                        case 'dateEnd':
                            if (typeof data.newValue === 'string')
                                dis[key] = new Date(data.newValue);
                            break;
                        case 'diseaseName':
                            if (typeof data.newValue === 'string')
                                dis[key] = data.newValue;
                            break;
                        default:
                            break;
                    }
                });
            }
            else {
                const key = data.property;
                this.dataService.updateMedication(data.id, (med) => {
                    switch (key) {
                        case 'medicationName':
                            if (typeof data.newValue === 'string')
                                med[key] = data.newValue;
                            break;
                        case 'dosage':
                            if (key in med && typeof data.newValue === 'number')
                                med[key] = data.newValue;
                            break;
                        case 'stock':
                            if (key in med && typeof data.newValue === 'number')
                                med[key] = data.newValue;
                            break;
                        case 'time':
                            if (typeof data.newValue === 'string')
                                med[key] = data.newValue.split(', ');
                            break;
                        default:
                            break;
                    }
                });
            }
        }
        console.log(this.dataService.getDiseases());
        this.changeInputData = [];
        (_a = this.sectionActive.querySelector('.edit')) === null || _a === void 0 ? void 0 : _a.remove();
        this.activeList.style.display = 'flex';
    }
    handleComeBack(e) {
        var _a;
        const target = e.target;
        const button = target.closest('.arrow-back');
        if (!button)
            return;
        this.changeInputData = [];
        (_a = this.sectionActive.querySelector('.edit')) === null || _a === void 0 ? void 0 : _a.remove();
        this.activeList.style.display = 'flex';
    }
    handleMedicationOpen(e) {
        const target = e.target;
        const medicationTitle = target.closest('.active__med-title');
        if (!medicationTitle)
            return;
        const medId = medicationTitle.getAttribute('data-id');
        if (!medId)
            return;
        const medContent = medicationTitle.closest('.active__med-content');
        if (!medContent)
            return;
        const isOpen = medicationTitle.classList.contains('open');
        const medication = this.dataService.findMedication(medId);
        if (!medication)
            return;
        medContent.innerHTML = !isOpen
            ? this.createMedicationComponent(medication)
            : `<h4 class="item-title active__med-title" data-id="${medication.medId}">
            ${medication.medicationName} <img src="img/arrow-bottom.svg" alt="Стрелка вниз" style="width: 25px;">
            </h4>`;
    }
    createMedicationComponent(med) {
        let dosType;
        if (med.type !== 'Аэрозоль' && med.type !== 'Мазь') {
            dosType = isDosageType(med);
        }
        else {
            dosType = '';
        }
        return `
        <h4 class="item-title active__med-title open" data-id="${med.medId}">${med.medicationName} <img src="img/arrow-top.svg" alt="Стрелка вверх" style="width: 25px;"></h4>
        <div class="active__card-bottom">
            ${(med.type !== 'Аэрозоль' && med.type !== 'Мазь') ? `<p class="active__dosage">Доза: <span>${med.dosage} ${dosType}</span></p>` : ''}
            ${(med.type === 'Таблетка' || med.type === 'Капсула' || med.type === 'Порошок' && med.dosageType === 'Пакетик') ? `<p class="active__stock">Осталось: <span>${med.stock}</span></p>` : ''}
            <p class="active__time">Время приёма: <span>${med.time.join(', ')}</span></p>
            <button class="item-button active__medication-delete" data-id="${med.medId}">Удалить приём</button>
        </div>
        `;
    }
    handleRemoveDiseaseCard(e) {
        const target = e.target;
        const button = target.closest('.active__disease-delete');
        if (!button)
            return;
        const id = button.getAttribute('data-disId');
        if (!id)
            return;
        this.dataService.removeDiseases(Number(id));
    }
    handleRemoveMedication(e) {
        const target = e.target;
        const button = target.closest('.active__medication-delete');
        if (!button)
            return;
        const medId = button.getAttribute('data-id');
        if (!medId)
            return;
        this.dataService.removeMedication(medId);
    }
    handleClickForEdit(e) {
        const target = e.target;
        const card = target.closest('.active__card');
        if (!card)
            return;
        if (target.closest('.active__med-content') || target.closest('.active__disease-delete'))
            return;
        const id = card.getAttribute('data-dis');
        if (!id)
            return;
        const dis = this.dataService.findDisease(Number(id));
        if (!dis)
            return;
        this.activeList.style.display = 'none';
        this.activeButton.style.display = 'none';
        this.sectionActive.insertAdjacentHTML('beforeend', this.createEditContainerComponent(dis));
    }
    createEditContainerComponent(dis) {
        return `
        <div class="edit">
            <button class="arrow arrow-back">
                <img src="img/arrow-left.svg" alt="Вернуться назад">
            </button>
            <form id="edit-form" class="edit__form">
            <div class="edit__top-content">
                <input class="list-title" type="text" value="${dis.diseaseName}" 
                data-property="diseaseName"
                data-object-id="${dis.id}"
                data-typeof-id="number"
                style="margin: 0;"
                >
                <button class="item-button edit__disease-delete" data-dis="${dis.id}">Удалить</button>
            </div>
            <div class="edit__date">
                <div class="edit__input-container edit__date--start">Назначен:<input type="text" value="${formatDateRu(dis.dateStart)}"
                data-property="dateStart"
                data-object-id="${dis.id}"
                data-typeof-id="number"
                ></div>
                <div class="edit__input-container edit__date--end">Окончание приёма:<input type="text" value="${formatDateRu(dis.dateEnd)}"
                data-property="dateEnd"
                data-object-id="${dis.id}"
                data-typeof-id="number"
                ></div>
            </div>
            </form>

        <ul class="edit__list">
        ${dis.medArray.length > 0 ? dis.medArray.map(med => this.createEditMedicationComponent(med)).join('') : ''}
        </ul>
        <button class="item-button edit__save-btn">Сохранить изменения</button>
        </div>
        `;
    }
    createEditMedicationComponent(med) {
        return `
        <li class="edit__item">
            <input type="text" class="item-title" value="${med.medicationName}"
            data-property="medicationName"
                data-object-id="${med.medId}"
                data-typeof-id="string"
            >
            <form class="edit__form-item">
                <div class="edit__card-top-content">
                ${med.type !== 'Аэрозоль' && med.type !== 'Мазь' ? `<div class="edit__input-container edit__dosage">Доза: <input type="number" value="${med.dosage}" min="0" step="0.1"
                data-property="dosage"
                data-object-id="${med.medId}"
                data-typeof-id="string"
                >табл.</div>` : ''} 
                ${med.type === 'Таблетка' || med.type === 'Капсула' || (med.type === 'Порошок' && med.dosageType === 'Пакетик') ? `<div class="edit__input-container edit__stock">Осталось: <input type="number" value="${med.stock}" min="1"
                data-property="stock"
                data-object-id="${med.medId}"
                data-typeof-id="string"
                ></div>` : ''}
                </div>

                <div class="edit__card-bottom">
                <div class="edit__input-container edit__time">Время приёма: <input type="text" value="${med.time.length > 0 ? med.time.join(', ') : ''}"
                data-property="time"
                data-object-id="${med.medId}"
                data-typeof-id="string"
                ></div>
                <button class="item-button edit__medication-delete" data-id="${med.medId}">Удалить приём</button>
                </div>
            </form>
        </li>
        `;
    }
}
