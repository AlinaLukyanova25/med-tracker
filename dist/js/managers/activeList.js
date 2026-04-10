import { DiseaseEditType, getElement, isValidDiseaseEditKey, isValidMedicationKey, MedicationEditType, querySelectorEl } from "../types/types.js";
import { collectsObjectByType, createTakenTimesArray, parseRussianDate } from "../core/timeUtils.js";
import { createChooseTypeMedComponent, createEditAddComponent, createEditContainerComponent, createEditMedicationComponent, createMedicationComponent } from "../ui/uiComponents.js";
let changeInputData = [];
export function modifyChangeInputData(reset) {
    if (reset) {
        changeInputData = [];
    }
}
export class ActiveListManager {
    constructor(dataService, modal) {
        this.toggleMedication = false;
        // private changeInputData: (InputDataDis<unknown> | InputDataMed<unknown>)[] = []
        this.removeMedIdArray = [];
        this.newMedications = [];
        this.scrollPosition = 0;
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
        this.activeList.addEventListener('click', (e) => this.handleRemoveDiseaseCard(e, '.active__disease-delete'));
        this.activeList.addEventListener('click', (e) => this.handleRemoveMedication(e, '.active__medication-delete'));
        this.activeList.addEventListener('click', (e) => this.handleClickForEdit(e));
        this.sectionActive.addEventListener('change', (e) => this.pendingChanges(e));
        this.sectionActive.addEventListener('click', (e) => this.handleRemoveDiseaseCard(e, '.edit__disease-delete'));
        this.sectionActive.addEventListener('click', (e) => this.handleRemoveMedication(e, '.edit__medication-delete'));
        this.sectionActive.addEventListener('click', (e) => this.handleAddMoreMedication(e));
        document.addEventListener('click', (e) => this.handleSaveEdit(e));
        document.addEventListener('click', (e) => this.handleComeBack(e));
    }
    pendingChanges(e) {
        const target = e.target;
        const input = target.closest('input');
        const textarea = target.closest('textarea');
        const element = input ? input : textarea;
        if (!element)
            return;
        if (element.tagName === 'TEXTAREA') {
            element.style.height = 'auto';
            element.style.height = element.scrollHeight + 'px';
        }
        if (!element.value.trim()) {
            this.modal.openModalWarning('Введите правильное значение');
            return;
        }
        const property = element.getAttribute('data-property');
        const id = element.getAttribute('data-object-id');
        const typeofId = element.getAttribute('data-typeof-id');
        if (!property || !id || !typeofId || (typeofId !== 'string' && typeofId !== 'number'))
            return;
        if (property === 'dateStart' || property === 'dateEnd') {
            const newValue = parseRussianDate(element.value, property, id, this.modal);
            if (!newValue)
                return;
            this.handleInputChange(property, id, typeofId, newValue);
            return;
        }
        else if (property === 'dosage') {
            if (Number(element.value) < 0) {
                this.modal.openModalWarning('Введите корректные значения');
                return;
            }
            this.handleInputChange(property, id, typeofId, Number(element.value));
            return;
        }
        else if (property === 'stock') {
            if (Number(element.value) < 1) {
                this.modal.openModalWarning('Введите корректные значения');
                return;
            }
            this.handleInputChange(property, id, typeofId, Number(element.value));
            return;
        }
        else if (property === 'time') {
            const times = element.value.split(', ');
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!(times.every(t => timeRegex.test(t)))) {
                this.modal.openModalWarning('Введите корректные данные');
                return;
            }
        }
        this.handleInputChange(property, id, typeofId, element.value);
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
        // this.changeInputData.push(changeInput)
        changeInputData.push(changeInput);
    }
    handleSaveEdit(e) {
        var _a;
        const target = e.target;
        const button = target.closest('.edit__save-btn');
        if (!button)
            return;
        const disId = button.getAttribute('data-dis');
        if (disId) {
            if (this.removeMedIdArray.length > 0) {
                this.removeMedIdArray.forEach(id => {
                    this.dataService.updateDisease(Number(disId), (dis) => {
                        dis.medArray = dis.medArray.filter(m => m.medId !== id);
                    });
                });
            }
            if (this.newMedications.length > 0) {
                this.newMedications.forEach(med => {
                    this.dataService.updateDisease(Number(disId), (dis) => {
                        dis.medArray.push(med);
                    });
                });
            }
        }
        for (let data of changeInputData) {
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
                            if (typeof data.newValue === 'string') {
                                med[key] = data.newValue.split(', ');
                                med.takenTimes = [];
                                const acceptedArray = createTakenTimesArray(med[key]);
                                if (acceptedArray.length !== 0) {
                                    med.takenTimes = acceptedArray;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        }
        console.log(this.dataService.getDiseases());
        changeInputData = [];
        this.removeMedIdArray = [];
        this.newMedications = [];
        (_a = this.sectionActive.querySelector('.edit')) === null || _a === void 0 ? void 0 : _a.remove();
        this.activeList.style.display = 'flex';
        this.activeButton.style.display = 'block';
        window.scrollTo(0, this.scrollPosition);
    }
    handleComeBack(e) {
        var _a;
        const target = e.target;
        const button = target.closest('.arrow-back');
        if (!button)
            return;
        changeInputData = [];
        this.removeMedIdArray = [];
        this.newMedications = [];
        (_a = this.sectionActive.querySelector('.edit')) === null || _a === void 0 ? void 0 : _a.remove();
        this.activeList.style.display = 'flex';
        this.activeButton.style.display = 'block';
        window.scrollTo(0, this.scrollPosition);
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
            ? createMedicationComponent(medication)
            : `<h4 class="item-title active__med-title" data-id="${medication.medId}">
            ${medication.medicationName} <img src="img/arrow-bottom.svg" alt="Стрелка вниз" style="width: 25px;">
            </h4>`;
    }
    handleAddMoreMedication(e) {
        var _a, _b, _c, _d;
        const target = e.target;
        const editList = document.querySelector('.edit__list');
        if (!editList)
            return;
        const button = target.closest('.edit__add-button');
        if (button) {
            if (editList.querySelector('.edit__item--choose') || editList.querySelector('.edit__item-add')) {
                editList.querySelector('.edit__item--choose')
                    ? (_a = editList.querySelector('.edit__item--choose')) === null || _a === void 0 ? void 0 : _a.remove()
                    : (_b = editList.querySelector('.edit__item-add')) === null || _b === void 0 ? void 0 : _b.remove();
                button.textContent = '+';
                return;
            }
            button.textContent = '-';
            editList.insertAdjacentHTML('beforeend', createChooseTypeMedComponent());
            return;
        }
        const buttonChoose = target.closest('.edit__button-choose');
        if (buttonChoose) {
            const type = buttonChoose.getAttribute('data-type');
            if (!type)
                return;
            let powderType;
            const attributePowder = buttonChoose.getAttribute('data-potype');
            if (attributePowder)
                powderType = attributePowder;
            const li = document.createElement('li');
            li.classList.add('edit__item', 'edit__item-add');
            li.setAttribute('data-type', type);
            if (attributePowder)
                li.setAttribute('data-potype', attributePowder);
            li.innerHTML = createEditAddComponent(type, powderType);
            (_c = editList.querySelector('.edit__item--choose')) === null || _c === void 0 ? void 0 : _c.replaceWith(li);
            (_d = li.querySelector('.edit__submit-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => this.handleAddForm(type, attributePowder, li, editList));
        }
    }
    handleAddForm(type, powderType, li, editList) {
        const medTitle = getElement('med-title');
        const dosage = document.getElementById('edit-dosage');
        const stock = document.getElementById('edit-stock');
        const time = getElement('edit-time');
        const medication = this.createMedOnType(type, powderType, medTitle, dosage, stock, time);
        if (!medication)
            return;
        this.newMedications.push(medication);
        li.remove();
        editList.insertAdjacentHTML('beforeend', createEditMedicationComponent(medication));
        console.log(this.newMedications);
    }
    createMedOnType(type, powderType, medTitle, dosage, stock, time) {
        if (!medTitle.value.trim()) {
            this.modal.openModalWarning('Введите корректное название');
            return;
        }
        if (dosage) {
            if (Number(dosage.value) < 0) {
                this.modal.openModalWarning('Введите корректную дозировку');
                return;
            }
        }
        if (stock) {
            if (Number(stock.value) < 0) {
                this.modal.openModalWarning('Введите корректный остаток');
                return;
            }
        }
        const times = time.value.split(', ');
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!(times.every(t => timeRegex.test(t)))) {
            this.modal.openModalWarning('Введите корректное время');
            return;
        }
        const acceptedArray = createTakenTimesArray(times);
        const base = collectsObjectByType(medTitle.value, times, acceptedArray, type, powderType, Number(dosage === null || dosage === void 0 ? void 0 : dosage.value), Number(stock === null || stock === void 0 ? void 0 : stock.value), this.modal);
        return base ? base : undefined;
    }
    handleRemoveDiseaseCard(e, classButton) {
        const target = e.target;
        const button = target.closest(classButton);
        if (!button)
            return;
        const id = button.getAttribute('data-dis');
        if (!id)
            return;
        this.modal.openModalConfidence(id);
        // this.dataService.removeDiseases(Number(id))
        // if (classButton === '.edit__disease-delete') {
        //     this.changeInputData = []
        //     this.sectionActive.querySelector('.edit')?.remove()
        //     this.activeList.style.display = 'flex'
        //     this.activeButton.style.display = 'block'
        // }
    }
    handleRemoveMedication(e, classButton) {
        e.preventDefault();
        const target = e.target;
        const button = target.closest(classButton);
        if (!button)
            return;
        const medId = button.getAttribute('data-id');
        if (!medId)
            return;
        if (classButton === '.active__medication-delete') {
            this.dataService.removeMedication(medId);
        }
        else {
            const card = button.closest('.edit__item');
            if (!card)
                return;
            card.remove();
            const newMed = this.newMedications.find(m => m.medId === medId);
            if (newMed) {
                this.newMedications = this.newMedications.filter(m => m.medId !== medId);
                return;
            }
            this.removeMedIdArray.push(medId);
        }
    }
    handleClickForEdit(e) {
        const target = e.target;
        const card = target.closest('.active__card');
        if (!card)
            return;
        this.scrollPosition = e.pageY - e.clientY;
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
        this.sectionActive.insertAdjacentHTML('beforeend', createEditContainerComponent(dis));
    }
}
