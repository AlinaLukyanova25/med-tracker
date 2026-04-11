import { Disease, Medication, MedicationType, Pill, Capsule, Powder } from "../types/data"
import { SortedMedication } from "../types/ui"
import { formatDate, formatDateRu, getTimeReception } from "./timeUtils.js"

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

export function sortAscendingOrderDate(arr: Disease[]): Disease[] {
    return arr
    .filter(dis => !dis.archive)
    .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime())
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

export function getActiveDateSet(diseases: Disease[]): Set<string> {
    const dates = new Set<string>()

    for (let dis of diseases) {
        if (dis.archive) continue

        const firstDay = new Date(dis.dateStart.getFullYear(), dis.dateStart.getMonth(), dis.dateStart.getDate())
        const lastDay = new Date(dis.dateEnd.getFullYear(), dis.dateEnd.getMonth(), dis.dateEnd.getDate())

        const diffMs = lastDay.getTime() - firstDay.getTime()

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

        const currentDate = new Date(firstDay);

        for (let day = 0; day < diffDays; day++) {
            const count = day === 0 ? 0 : 1

            currentDate.setDate(currentDate.getDate() + count);

            dates.add(formatDate(currentDate))
        }
        
    }

    return dates
}