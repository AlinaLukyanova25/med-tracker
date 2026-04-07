export function getElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Элемент #${id} не найден`);
    return el;
}
export function querySelectorEl(selector) {
    const el = document.querySelector(selector);
    if (!el)
        throw new Error(`Элемент "${selector}" не найден`);
    return el;
}
export function isKeyOf(key, obj) {
    return key in obj;
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
export function isValidDiseaseEditKey(key) {
    return Object.values(DiseaseEditType).includes(key);
}
