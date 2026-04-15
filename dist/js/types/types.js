export function getElement(id, typeGuard) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Элемент #${id} не найден`);
    if (!(el instanceof typeGuard)) {
        throw new Error(`Найденный элемент "${id}" не соответствует ожидаемому типу ${typeGuard.name}`);
    }
    return el;
}
export function querySelectorEl(selector, typeGuard) {
    const el = document.querySelector(selector);
    if (!el)
        throw new Error(`Элемент "${selector}" не найден`);
    if (!(el instanceof typeGuard)) {
        throw new Error(`Найденный элемент "${selector}" не соответствует ожидаемому типу ${typeGuard.name}`);
    }
    return el;
}
export var SelectMedicationType;
(function (SelectMedicationType) {
    SelectMedicationType["Pill"] = "Pill";
    SelectMedicationType["Capsule"] = "Capsule";
    SelectMedicationType["Mixture"] = "Mixture";
    SelectMedicationType["Drops"] = "Drops";
    SelectMedicationType["Aerosol"] = "Aerosol";
    SelectMedicationType["Ointment"] = "Ointment";
    SelectMedicationType["Powder"] = "Powder";
})(SelectMedicationType || (SelectMedicationType = {}));
export var SelectPowderType;
(function (SelectPowderType) {
    SelectPowderType["Sachet"] = "Sachet";
    SelectPowderType["Spoon"] = "Spoon";
})(SelectPowderType || (SelectPowderType = {}));
export var DiseaseEditType;
(function (DiseaseEditType) {
    DiseaseEditType["dateStart"] = "dateStart";
    DiseaseEditType["dateEnd"] = "dateEnd";
    DiseaseEditType["diseaseName"] = "diseaseName";
})(DiseaseEditType || (DiseaseEditType = {}));
export var MedicationEditType;
(function (MedicationEditType) {
    MedicationEditType["medicationName"] = "medicationName";
    MedicationEditType["dosage"] = "dosage";
    MedicationEditType["stock"] = "stock";
    MedicationEditType["time"] = "time";
})(MedicationEditType || (MedicationEditType = {}));
export function isValidMedicationKey(key) {
    return Object.values(MedicationEditType).includes(key);
}
export function isValidDiseaseEditTypeKey(key) {
    return Object.values(DiseaseEditType).includes(key);
}
export function isValidMedicationType(value) {
    if (!value)
        return false;
    return Object.values(SelectMedicationType).includes(value);
}
export function isDosageType(med) {
    let dosType;
    switch (med.type) {
        case 'Таблетка':
            dosType = 'таб.';
            break;
        case 'Капсула':
            dosType = 'капс.';
            break;
        case 'Микстура':
            dosType = 'мер. лож.';
            break;
        case 'Капли':
            dosType = 'кап.';
            break;
        case 'Порошок':
            dosType = med.dosageType === 'Пакетик' ? 'саш.' : 'мер. лож.';
            break;
    }
    return dosType;
}
export function collectsObjectByType(medicationName, time, acceptedArray, medType, powderType, dosage, stock, modal) {
    const base = {
        medId: crypto.randomUUID(),
        medicationName,
        time,
        takenTimes: acceptedArray.length !== 0 ? acceptedArray : [],
        lastTakenUpdate: new Date().toISOString(),
    };
    switch (medType) {
        case SelectMedicationType.Pill:
            if (!dosage || !stock)
                return showError(modal);
            return { ...base, type: 'Таблетка', dosage, stock };
        case SelectMedicationType.Capsule:
            if (!dosage || !stock)
                return showError(modal);
            return { ...base, type: 'Капсула', dosage, stock };
        case SelectMedicationType.Mixture:
            if (!dosage)
                return showError(modal);
            return { ...base, type: 'Микстура', dosage };
        case SelectMedicationType.Drops:
            if (!dosage)
                return showError(modal);
            return { ...base, type: 'Капли', dosage };
        case SelectMedicationType.Aerosol:
            return { ...base, type: 'Аэрозоль' };
        case SelectMedicationType.Ointment:
            return { ...base, type: 'Мазь' };
        case SelectMedicationType.Powder:
            if (powderType === SelectPowderType.Sachet) {
                if (!dosage || !stock)
                    return showError(modal);
                return { ...base, type: 'Порошок', dosageType: 'Пакетик', dosage, stock };
            }
            else {
                if (!dosage)
                    return showError(modal);
                return { ...base, type: 'Порошок', dosageType: 'Ложка', dosage };
            }
    }
}
function showError(modal) {
    modal.openModalWarning('Введите все значения');
    return;
}
