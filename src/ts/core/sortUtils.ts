import { Disease, Medication, MedicationType, SortedMedication, Pill, Capsule, Powder } from "../types/common"
import { getTimeReception } from "./timeUtils.js"

export function sortByOrderHours(arr: Disease[], medications: MedicationType[]): SortedMedication[] {
    const newArr = medications
    const sortedArr: SortedMedication[] = []

    for (let medication of newArr) {
        const result = getTimeReception(medication.time)

        for (let time of result) {
            if (medication.takenTimes.includes(time.toISOString())) continue

            const medAndTime: SortedMedication = {
                time: time,
                medication: medication,
            }

            sortedArr.push(medAndTime)
        }
    }

    return sortedArr.sort((a, b) => a.time.getTime() - b.time.getTime())
}

function hasStock(med: MedicationType): med is Extract<MedicationType, Pill | Capsule | Powder<'Пакетик'>> {
  return (med.type === 'Таблетка' ||
         med.type === 'Капсула' ||
         (med.type === 'Порошок' && med.dosageType === 'Пакетик')) &&
        med.stock !== undefined && typeof med.stock === 'number';
}

export function sortStock(arr: Disease[], medication: MedicationType[]): Extract<MedicationType, Pill | Capsule | Powder<'Пакетик'>>[]{
    const items = medication
        .filter(hasStock)
        .filter(med => med.stock !== undefined && med.stock <= 5)
        .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    return items
}