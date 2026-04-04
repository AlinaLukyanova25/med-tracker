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
