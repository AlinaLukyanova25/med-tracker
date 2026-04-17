import { getElement, isValidDiseaseEditTypeKey, querySelectorEl, collectsObjectByType, isValidMedicationType, isValidMedicationKey } from "../types/types.js";
import { createTakenTimesArray, parseRussianDate } from "../core/dateUtils.js";
import { createChooseTypeMedComponent, createEditAddComponent, createEditContainerComponent, createEditMedicationComponent, createMedicationComponent } from "../ui/uiComponents.js";
import { domElements } from "../core/domElements.js";
let changeInputData = [];
export function modifyChangeInputData(reset) {
    if (reset) {
        changeInputData = [];
    }
}
export class ActiveListManager {
    constructor(dataService, modal) {
        this.sectionActive = domElements.sectionActive;
        this.activeList = domElements.activeList;
        this.activeButton = domElements.activeButton;
        this.removeMedIdArray = [];
        this.newMedications = [];
        this.focusElement = null;
        this.scrollPosition = 0;
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
        if (!(target instanceof HTMLElement))
            return;
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
            const timesArray = element.value.split(', ');
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!(timesArray.every(t => timeRegex.test(t)))) {
                this.modal.openModalWarning('Введите корректные данные');
                return;
            }
            const times = timesArray.map(t => {
                if (t.length === 4) {
                    return `0${t}`;
                }
                return t;
            });
            this.handleInputChange(property, id, typeofId, times);
            return;
        }
        this.handleInputChange(property, id, typeofId, element.value);
    }
    handleInputChange(property, id, typeofId, newValue) {
        let changeInput;
        if (typeofId === 'number' && isValidDiseaseEditTypeKey(property)) {
            changeInput = {
                property: property,
                id,
                typeofId,
                newValue
            };
        }
        else if (typeofId === 'string' && isValidMedicationKey(property)) {
            changeInput = {
                property: property,
                id,
                typeofId,
                newValue
            };
        }
        else {
            this.modal.openModalWarning('Недопустимое поле для болезни');
            return;
        }
        changeInputData.push(changeInput);
    }
    handleSaveEdit(e) {
        var _a;
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
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
        for (const data of changeInputData) {
            if (data.typeofId === 'number') {
                const key = data.property;
                if (!['diseaseName', 'dateStart', 'dateEnd'].includes(key)) {
                    console.warn(`Недопустимый ключ: ${key}. Операция отменена.`);
                    continue;
                }
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
                if (!['medicationName', 'time', 'stock', 'dosage'].includes(key)) {
                    console.warn(`Недопустимый ключ: ${key}. Операция отменена.`);
                    continue;
                }
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
                            if (Array.isArray(data.newValue)) {
                                med[key] = data.newValue;
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
        changeInputData = [];
        this.removeMedIdArray = [];
        this.newMedications = [];
        (_a = this.sectionActive.querySelector('.edit')) === null || _a === void 0 ? void 0 : _a.remove();
        this.activeList.style.display = 'flex';
        this.activeButton.style.display = 'block';
        window.scrollTo(0, this.scrollPosition);
        this.putsFocus();
    }
    handleComeBack(e) {
        var _a;
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
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
        this.putsFocus();
    }
    handleMedicationOpen(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
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
            : `<h4 class="item-title active__med-title" data-id="${medication.medId}"tabindex="0" aria-label="Кликабельный заголовок ${medication.medicationName} открыть">
            ${medication.medicationName} <img src="img/arrow-bottom.svg" alt="" aria-hidden="true" style="width: 25px;">
            </h4>`;
    }
    handleAddMoreMedication(e) {
        var _a, _b, _c;
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest('.edit__add-button');
        const buttonChoose = target.closest('.edit__button-choose');
        if (!button && !buttonChoose)
            return;
        const editList = querySelectorEl('.edit__list', HTMLUListElement);
        if (button) {
            if (editList.querySelector('.edit__item--choose') || editList.querySelector('.edit__item-add')) {
                const chooseItem = editList.querySelector('.edit__item--choose');
                if (chooseItem) {
                    chooseItem.remove();
                }
                else {
                    (_a = editList.querySelector('.edit__item-add')) === null || _a === void 0 ? void 0 : _a.remove();
                }
                button.textContent = '+';
                button.ariaLabel = 'Добавить новое лекарство';
                return;
            }
            button.textContent = '-';
            button.ariaLabel = 'Закрыть создание лекарства';
            editList.insertAdjacentHTML('beforeend', createChooseTypeMedComponent());
            querySelectorEl('.edit__item--choose', HTMLLIElement).focus();
            return;
        }
        if (buttonChoose) {
            const type = buttonChoose.getAttribute('data-type');
            if (!isValidMedicationType(type))
                return;
            let powderType;
            const attributePowder = buttonChoose.getAttribute('data-potype');
            if (attributePowder)
                powderType = attributePowder;
            const li = document.createElement('li');
            li.classList.add('edit__item', 'edit__item-add');
            li.setAttribute('tabindex', '0');
            li.setAttribute('data-type', type);
            if (attributePowder)
                li.setAttribute('data-potype', attributePowder);
            li.innerHTML = createEditAddComponent(type, powderType);
            (_b = editList.querySelector('.edit__item--choose')) === null || _b === void 0 ? void 0 : _b.replaceWith(li);
            (_c = li.querySelector('.edit__submit-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.handleAddForm(type, attributePowder, li, editList));
        }
    }
    handleAddForm(type, powderType, li, editList) {
        const medTitle = getElement('med-title', HTMLTextAreaElement);
        const dosage = document.getElementById('edit-dosage');
        const stock = document.getElementById('edit-stock');
        const time = getElement('edit-time', HTMLInputElement);
        const medication = this.createMedOnType(type, powderType, medTitle, dosage, stock, time);
        if (!medication)
            return;
        this.newMedications.push(medication);
        li.remove();
        editList.insertAdjacentHTML('beforeend', createEditMedicationComponent(medication));
        const btn = querySelectorEl('.edit__add-button', HTMLButtonElement);
        btn.textContent = '+';
        btn.ariaLabel = 'Добавить новое лекарство';
    }
    createMedOnType(type, powderType, medTitle, dosage, stock, time) {
        if (!medTitle.value.trim()) {
            this.modal.openModalWarning('Введите корректное название');
            return;
        }
        if (dosage instanceof HTMLInputElement) {
            if (Number(dosage.value) < 0) {
                this.modal.openModalWarning('Введите корректную дозировку');
                return;
            }
        }
        if (stock instanceof HTMLInputElement) {
            if (Number(stock.value) < 0) {
                this.modal.openModalWarning('Введите корректный остаток');
                return;
            }
        }
        const timesArray = time.value.split(', ');
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!(timesArray.every(t => timeRegex.test(t)))) {
            this.modal.openModalWarning('Введите корректное время');
            return;
        }
        const times = timesArray.map(t => {
            if (t.length === 4) {
                return `0${t}`;
            }
            return t;
        });
        const acceptedArray = createTakenTimesArray(times);
        const base = collectsObjectByType(medTitle.value, times, acceptedArray, type, powderType, dosage instanceof HTMLInputElement ? Number(dosage.value) : null, stock instanceof HTMLInputElement ? Number(stock.value) : null, this.modal);
        return base ? base : undefined;
    }
    handleRemoveDiseaseCard(e, classButton) {
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const button = target.closest(classButton);
        if (!(button instanceof HTMLButtonElement))
            return;
        const id = button.getAttribute('data-dis');
        if (!id)
            return;
        this.modal.openModalConfidence(e, id, button);
    }
    handleRemoveMedication(e, classButton) {
        e.preventDefault();
        const target = e.target;
        if (!(target instanceof HTMLElement))
            return;
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
        if (!(target instanceof HTMLElement))
            return;
        const card = target.closest('.active__card');
        if (!(card instanceof HTMLLIElement))
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
        this.openEditCard(dis);
        this.focusElement = `.active__card[data-dis="${id}"]`;
    }
    openEditCard(dis) {
        this.sectionActive.style.display = 'block';
        this.activeList.style.display = 'none';
        this.activeButton.style.display = 'none';
        this.sectionActive.insertAdjacentHTML('beforeend', createEditContainerComponent(dis));
    }
    putsFocus() {
        if (this.focusElement) {
            const focus = querySelectorEl(this.focusElement, HTMLElement);
            if (!focus)
                return;
            if (!focus.hasAttribute('tabindex')) {
                focus.setAttribute('tabindex', '0');
            }
            focus.focus();
            if (document.activeElement !== focus) {
                console.warn('Фокус не установился на элемент', focus);
            }
        }
        else {
            querySelectorEl('.header-list__link', HTMLAnchorElement).focus();
        }
        this.focusElement = null;
    }
}
