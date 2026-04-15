import { formatDate, getTimeReception } from "./dateUtils.js";
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
export function sortAscendingOrderDate(arr) {
    return arr
        .filter(dis => !dis.archive)
        .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
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
export function getActiveDateSet(diseases) {
    const dates = new Set();
    for (let dis of diseases) {
        if (dis.archive)
            continue;
        const firstDay = new Date(dis.dateStart.getFullYear(), dis.dateStart.getMonth(), dis.dateStart.getDate());
        const lastDay = new Date(dis.dateEnd.getFullYear(), dis.dateEnd.getMonth(), dis.dateEnd.getDate());
        const diffMs = lastDay.getTime() - firstDay.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        const currentDate = new Date(firstDay);
        for (let day = 0; day < diffDays; day++) {
            const count = day === 0 ? 0 : 1;
            currentDate.setDate(currentDate.getDate() + count);
            dates.add(formatDate(currentDate));
        }
    }
    return dates;
}
