import { SelectMedicationType, SelectPowderType, collectsObjectByType, isValidMedicationType } from "../types/types.js";
import { renderActiveList } from "../ui/renderService.js";
import { createTakenTimesArray, DateUtils, formatDate } from "../core/dateUtils.js";
import { domElements } from "../core/domElements.js";
export class DiseasesManager {
    constructor(modal, dataService) {
        this.times = [];
        this.medArray = [];
        this.activeList = domElements.activeList;
        this.addForm = domElements.disease.addForm;
        this.diseaseName = domElements.disease.diseaseName;
        this.medicationName = domElements.disease.medicationName;
        this.time = domElements.disease.time;
        this.timeLabel = domElements.disease.timeLabel;
        this.selectType = domElements.disease.selectType;
        this.labelPowderType = domElements.disease.labelPowderType;
        this.selectPowderType = domElements.disease.selectPowderType;
        this.labelDosage = domElements.disease.labelDosage;
        this.dosage = domElements.disease.dosage;
        this.labelStock = domElements.disease.labelStock;
        this.stock = domElements.disease.stock;
        this.dateEnd = domElements.disease.dateEnd;
        this.addAgain = domElements.disease.addAgain;
        this.againDateEnd = domElements.disease.againDateEnd;
        this.moreMedButton = domElements.disease.moreMedButton;
        this.receptionList = domElements.receptionList;
        this.missedList = domElements.missedList;
        this.modal = modal;
        this.dataService = dataService;
        this.init();
    }
    init() {
        this.setupEventListeners();
        DateUtils.setMinDate(this.dateEnd);
        DateUtils.setMinDate(this.againDateEnd);
        this.dataService.subscribe(() => {
            this.render();
        });
        this.render();
    }
    render() {
        renderActiveList(this.dataService.getDiseases(), this.activeList);
    }
    setupEventListeners() {
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e));
        this.timeLabel.addEventListener('click', (e) => this.handleLabelTimeClick(e));
        this.moreMedButton.addEventListener('click', (e) => this.handleAddMoreMedication(e));
        this.addAgain.addEventListener('submit', (e) => this.handleAgainFormSubmit(e));
        this.selectType.addEventListener('change', () => this.chooseTypeMedication());
        this.selectPowderType.addEventListener('change', () => this.chooseDosageType());
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
        const medArray = this.medArray.length;
        const medType = this.selectType.value;
        if (!disName) {
            this.modal.openModalWarning('Введите корректное болезни');
            return;
        }
        if (isNaN(dateEnd.getTime())) {
            this.modal.openModalWarning('Укажите корректную дату окончания');
            return;
        }
        if (!medArray && this.medArray.length === 0 || medName || dosage || stock || time) {
            if (!medName) {
                this.modal.openModalWarning('Введите корректное название лекарства');
                return;
            }
            if (!time && this.times.length === 0) {
                this.modal.openModalWarning('Введите время приёма');
                return;
            }
            if (time)
                this.times.push(time);
            if (!isValidMedicationType(medType))
                return;
            const medication = this.createMedicationOnType(medType, medName, this.times, dosage, stock);
            if (!medication)
                return;
            this.medArray.push(medication);
            this.times = [];
            this.labelPowderType.style.display = 'none';
            this.selectPowderType.style.display = 'none';
            this.labelDosage.style.display = 'block';
            this.dosage.style.display = 'block';
            this.dosage.placeholder = 'Введите в таблетках';
            this.labelStock.style.display = 'block';
            this.stock.style.display = 'block';
        }
        const disease = {
            id: Date.now(),
            diseaseName: disName,
            dateStart: new Date(),
            dateEnd: dateEnd,
            archive: false,
            medArray: this.medArray
        };
        this.dataService.addDisease(disease);
        this.medArray = [];
        this.modal.addHidden('modal');
        this.addForm.reset();
        this.checkMainPage();
    }
    handleAddMoreMedication(e) {
        var _a;
        e.preventDefault();
        this.medicationName.focus();
        const disName = this.diseaseName.value.trim();
        const medName = this.medicationName.value.trim();
        const dosage = Number(this.dosage.value);
        const stock = Number(this.stock.value);
        const dateEnd = (_a = this.dateEnd) === null || _a === void 0 ? void 0 : _a.value;
        const time = this.time.value;
        const medType = this.selectType.value;
        if (!disName || !medName) {
            this.modal.openModalWarning('Введите корректные названия');
            return;
        }
        if (!time && this.times.length === 0) {
            this.modal.openModalWarning('Введите время приёма');
            return;
        }
        if (time)
            this.times.push(time);
        if (!isValidMedicationType(medType))
            return;
        const medication = this.createMedicationOnType(medType, medName, this.times, dosage, stock);
        if (!medication)
            return;
        this.medArray.push(medication);
        this.times = [];
        this.time.value = '';
        this.medicationName.value = '';
        this.dosage.value = '';
        this.stock.value = '';
        this.chooseTypeMedication();
    }
    createMedicationOnType(medType, medicationName, time, dosage, stock) {
        const acceptedArray = createTakenTimesArray(time);
        const base = collectsObjectByType(medicationName, time, acceptedArray, medType, this.selectPowderType.value, dosage, stock, this.modal);
        return base ? base : undefined;
    }
    medicationConfig() {
        return {
            [SelectMedicationType.Pill]: { dosage: true, stock: true, placeholder: 'Введите в таблетках' },
            [SelectMedicationType.Capsule]: { dosage: true, stock: true, placeholder: 'Введите в капсулах' },
            [SelectMedicationType.Mixture]: { dosage: true, stock: false, placeholder: 'Введите в мер.ложках' },
            [SelectMedicationType.Drops]: { dosage: true, stock: false, placeholder: 'Введите в каплях' },
            [SelectMedicationType.Aerosol]: { dosage: false, stock: false },
            [SelectMedicationType.Ointment]: { dosage: false, stock: false },
            [SelectMedicationType.Powder]: { special: true },
        };
    }
    chooseTypeMedication() {
        const valueType = this.selectType.value;
        if (!isValidMedicationType(valueType))
            return;
        const config = this.medicationConfig()[valueType];
        if (!config)
            return;
        this.labelPowderType.style.display = 'none';
        this.selectPowderType.style.display = 'none';
        if ('dosage' in config) {
            this.labelDosage.style.display = config.dosage ? 'block' : 'none';
            this.dosage.style.display = config.dosage ? 'block' : 'none';
        }
        if ('stock' in config) {
            this.labelStock.style.display = config.stock ? 'block' : 'none';
            this.stock.style.display = config.stock ? 'block' : 'none';
        }
        if ('placeholder' in config)
            this.dosage.placeholder = config.placeholder;
        if (valueType === SelectMedicationType.Powder) {
            this.labelPowderType.style.display = 'block';
            this.selectPowderType.style.display = 'block';
            this.chooseDosageType();
        }
    }
    chooseDosageType() {
        const valueTyle = this.selectPowderType.value;
        switch (valueTyle) {
            case SelectPowderType.Sachet:
                this.labelDosage.style.display = 'block';
                this.dosage.style.display = 'block';
                this.dosage.placeholder = 'Введите в пакетиках';
                this.labelStock.style.display = 'block';
                this.stock.style.display = 'block';
                break;
            case SelectPowderType.Spoon:
                this.labelDosage.style.display = 'block';
                this.dosage.style.display = 'block';
                this.dosage.placeholder = 'Введите в мер.ложках';
                this.labelStock.style.display = 'none';
                this.stock.style.display = 'none';
        }
    }
    handleAgainFormSubmit(e) {
        e.preventDefault();
        const dateEnd = new Date(this.againDateEnd.value);
        if (isNaN(dateEnd.getTime())) {
            this.modal.openModalWarning('Укажите корректную дату окончания');
            return;
        }
        const id = this.addAgain.getAttribute('data-id');
        if (!id)
            return;
        this.dataService.updateDisease(Number(id), (dis) => {
            dis.dateStart = new Date();
            dis.dateEnd = dateEnd;
            dis.archive = false;
        });
        this.modal.addHidden('again');
        this.addAgain.reset();
        this.checkMainPage();
    }
    handleLabelTimeClick(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const addMore = target.closest('.modal__add-more');
        if (!addMore)
            return;
        if (!this.time.value)
            return;
        this.times.push(this.time.value);
        this.time.value = '';
    }
    checkMainPage() {
        const markedDate = this.dataService.findMarkedDates(formatDate(new Date()));
        if (!markedDate)
            return;
        if (!markedDate.taken)
            return;
        if (this.receptionList.querySelectorAll('.reception-list__item').length !== 0 ||
            this.missedList.querySelectorAll('.missed-list__item').length !== 0) {
            this.dataService.updateMarkedDate(markedDate.date, (md) => {
                md.taken = false;
            });
        }
    }
}
