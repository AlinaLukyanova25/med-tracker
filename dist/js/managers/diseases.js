import { getElement, querySelectorEl } from "../types/types.js";
import { renderActiveList } from "../ui/renderService.js";
import { DateUtils } from "../core/timeUtils.js";
export class DiseasesManager {
    constructor(modal, dataService) {
        this.times = [];
        this.medArray = [];
        this.activeList = querySelectorEl('.active__list');
        this.addForm = getElement('add-reception');
        this.diseaseName = getElement('disease-name');
        this.medicationName = getElement('medication-name');
        this.time = getElement('reception-time');
        this.timeLabel = getElement('time-label');
        this.dosage = getElement('reception-dosage');
        this.stock = getElement('reception-stock');
        this.dateEnd = getElement('reception-end');
        this.moreMedButton = querySelectorEl('.modal__more-btn');
        this.addAgain = getElement('add-again');
        this.againDateEnd = getElement('reception-again-end');
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
        console.log('Обработчик submit в reception');
        this.addForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e));
        this.timeLabel.addEventListener('click', (e) => this.handleLabelTimeClick(e));
        this.moreMedButton.addEventListener('click', (e) => this.handleAddMoreMedication(e));
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
        if (!disName) {
            alert('Введите корректное болезни');
            return;
        }
        if (isNaN(dateEnd.getTime())) {
            alert('Укажите корректную дату окончания');
            return;
        }
        if (!medArray && this.medArray.length === 0 || medName || dosage || stock || time) {
            if (!medName) {
                alert('Введите корректное название лекарства');
            }
            if (!time && this.times.length === 0) {
                alert('Введите время приёма');
                return;
            }
            if (time)
                this.times.push(time);
            const medication = {
                medId: crypto.randomUUID(),
                medicationName: medName,
                time: this.times,
                dosage: dosage,
                stock: stock,
                takenTimes: [],
                lastTakenUpdate: new Date().toISOString(),
            };
            this.medArray.push(medication);
            this.times = [];
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
    }
    handleAddMoreMedication(e) {
        var _a;
        e.preventDefault();
        const disName = this.diseaseName.value.trim();
        const medName = this.medicationName.value.trim();
        const dosage = Number(this.dosage.value);
        const stock = Number(this.stock.value);
        const dateEnd = (_a = this.dateEnd) === null || _a === void 0 ? void 0 : _a.value;
        const time = this.time.value;
        if (!disName || !medName) {
            alert('Введите корректные названия');
            return;
        }
        if (!time && this.times.length === 0) {
            alert('Введите время приёма');
            return;
        }
        if (time)
            this.times.push(time);
        const medication = {
            medId: crypto.randomUUID(),
            medicationName: medName,
            time: this.times,
            dosage: dosage,
            stock: stock,
            takenTimes: [],
            lastTakenUpdate: new Date().toISOString(),
        };
        this.medArray.push(medication);
        this.times = [];
        this.addForm.reset();
        this.diseaseName.value = disName;
        this.dateEnd.value = dateEnd;
    }
    // handleAgainFormSubmit(e: Event) {
    //     e.preventDefault()
    //     const dateEnd = new Date(this.againDateEnd.value)
    //     if (isNaN(dateEnd.getTime())) {
    //         alert('Укажите корректную дату окончания')
    //         return
    //     }
    //     const id = this.addAgain.getAttribute('data-id')
    //     if (!id) return
    //     this.dataService.updateDisease(Number(id), (rec) => {
    //         rec.dateEnd = dateEnd;
    //         rec.archive = false;
    //     })
    //     this.modal.addHidden('again')
    //     this.addAgain.reset()
    // }
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
}
