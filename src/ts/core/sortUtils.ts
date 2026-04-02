import { Disease, Medication, SortedMedication } from "../types/common"
import { getTimeReception } from "./timeUtils.js"

export function sortByOrderHours(arr: Disease[], medications: Medication[]): SortedMedication[] {
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

export function sortStock(arr: Disease[], medication: Medication[]): Medication[] {
    const items = medication
        .filter(med => med.stock <= 5)
        .sort((a, b) => a.stock - b.stock)
    return items
}