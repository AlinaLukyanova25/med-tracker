import { querySelectorEl } from "../types/types.js";
import { isDosageType } from "../core/timeUtils.js";
export class ActiveListManager {
    constructor(dataService) {
        this.toggleMedication = false;
        this.activeList = querySelectorEl('.active__list');
        this.dataService = dataService;
        this.init();
    }
    init() {
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.activeList.addEventListener('click', (e) => this.handleMedicationOpen(e));
        this.activeList.addEventListener('click', (e) => this.handleRemoveDiseaseCard(e));
        this.activeList.addEventListener('click', (e) => this.handleRemoveMedication(e));
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
}
