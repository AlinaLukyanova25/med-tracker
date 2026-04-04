import { getTimeReception } from "./timeUtils.js";
export function sortByOrderHours(arr, medications) {
    const newArr = medications;
    const sortedArr = [];
    for (let medication of newArr) {
        const result = getTimeReception(medication.time);
        for (let time of result) {
            if (medication.takenTimes.includes(time.toISOString()))
                continue;
            const medAndTime = {
                time: time,
                medication: medication,
            };
            sortedArr.push(medAndTime);
        }
    }
    return sortedArr.sort((a, b) => a.time.getTime() - b.time.getTime());
}
function hasStock(med) {
    return (med.type === 'Таблетка' ||
        med.type === 'Капсула' ||
        (med.type === 'Порошок' && med.dosageType === 'Пакетик')) &&
        med.stock !== undefined && typeof med.stock === 'number';
}
export function sortStock(arr, medication) {
    const items = medication
        .filter(hasStock)
        .filter(med => med.stock !== undefined && med.stock <= 5)
        .sort((a, b) => { var _a, _b; return ((_a = a.stock) !== null && _a !== void 0 ? _a : 0) - ((_b = b.stock) !== null && _b !== void 0 ? _b : 0); });
    return items;
}
