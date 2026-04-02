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
export function sortStock(arr, medication) {
    const items = medication
        .filter(med => med.stock <= 5)
        .sort((a, b) => a.stock - b.stock);
    return items;
}
