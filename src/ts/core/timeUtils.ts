import { ModalManager } from "../managers/modal";
import { Aerosol, DosageType, Medication, MedType, Ointment, PowderDosageType, MedicationType } from "../types/data"
import { PluralRule } from "../types/ui";
import { querySelectorEl, SelectMedicationType, SelectPowderType } from "../types/types.js";

export const DateUtils = {
    getTodayDate() {
        return new Date();
    },

    getTomorrowDate() {
        const today = this.getTodayDate();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        return nextDay;
    },

    getTomorrowDateString() {
        const nextDay = this.getTomorrowDate();
        const year = nextDay.getFullYear();
        const month = String(nextDay.getMonth() + 1).padStart(2, '0');
        const day = String(nextDay.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    setMinDate(element: HTMLInputElement) {
        if (!element) {
        console.warn('Элемент не найден');
        return;
        }

        element.setAttribute('min', this.getTomorrowDateString());
    },
}

export function getTimeReception(time: string[], date = new Date()): Date[] {
    return time.map(t => new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(t.slice(0, 2)),
        Number(t.slice(3))
    ))
}

export function shouldUpdateTaken(date: string): boolean {
    const lastUpdate = new Date(date);
    const today = new Date();
        
    return (
        lastUpdate.getFullYear() !== today.getFullYear() ||
        lastUpdate.getMonth() !== today.getMonth() ||
        lastUpdate.getDate() !== today.getDate()
    );
}

export function isDatePassed(date1: Date, date2 = new Date()): boolean {
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)

    return d2 > d1
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function formatDateRu(date: Date): string {
    return date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
} 

export function checkRecedptionTime(time: string): boolean {
    const now = new Date()
    const timeDate = new Date(time)

    if (!timeDate) return false

    return (timeDate.getTime() - now.getTime()) < 900000
}

if (!globalThis.Intl) {
  globalThis.Intl = Intl;
}

const formatter = new Intl.PluralRules('ru');

export function getWordForm(count: number, one: string, few: string, many: string, other: string): string {
  const rule = formatter.select(count) as PluralRule;
  const forms: Record<PluralRule, string> = {
    one,
    few,
    many,
    other
  };
  return forms[rule];
}

export function isDosageType(med: Exclude<MedicationType, Aerosol | Ointment>): DosageType {
    let dosType: DosageType
    switch (med.type) {
        case 'Таблетка':
            dosType = 'таб.'
            break
        case 'Капсула':
            dosType = 'капс.'
            break
        case 'Микстура':
            dosType = 'мер. лож.'
            break
        case 'Капли':
            dosType = 'кап.'
            break
        case 'Порошок':
            dosType = med.dosageType === 'Пакетик' ? 'саш.' : 'мер. лож.'
            break
    }
    return dosType
}

export function parseRussianDate(value: string, property: 'dateStart' | 'dateEnd', id: string, modal: ModalManager): boolean | string {
        if (value.length > 11) {
            modal.openModalWarning('Введите корректные данные')
            return false
        }

        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const monthInInput = monthNames.find(m => value.toLowerCase().includes(m))

        if (!monthInInput) {
            modal.openModalWarning('Введите правильное значение месяца')
            return false
        }

        const dateArray = value.split(' ')

        const newValue = `${new Date().getFullYear()}-${String(monthNames.findIndex(m => m === monthInInput) + 1).padStart(2, '0')}-${String(dateArray[0]).padStart(2, '0')}`

        if (isNaN(new Date(newValue).getTime())) {
            modal.openModalWarning('Введите корректную дату')
            return false
        }
    
        const otherInput = querySelectorEl<HTMLInputElement>(`input[data-property="${
            property === 'dateStart' ? 'dateEnd' : 'dateStart'
        }"][data-object-id="${id}"]`)

        const otherDateArray = otherInput.value.split(' ')

        const otherDate = `${new Date().getFullYear()}-${String(monthNames.findIndex(m => m === otherDateArray[1]) + 1).padStart(2, '0')}-${String(otherDateArray[0]).padStart(2, '0')}`

        if (isNaN(new Date(otherDate).getTime())) {
            modal.openModalWarning('Невозможно сравнивать с некорректной датой')
            return false
        }
        
        if (property === 'dateStart' && isDatePassed(new Date(otherDate), new Date(newValue))) {
                modal.openModalWarning('Дата назначения не может быть больше даты окончания')
                return false
        }
        if (property === 'dateEnd' && !isDatePassed(new Date(otherDate), new Date(newValue))) {
                modal.openModalWarning('Дата окончания не может быть меньше даты назначения')
                return false
        }

        return newValue

}

export function collectsObjectByType(
    medicationName: string,
    time: string[],
    acceptedArray: string[],
    medType: SelectMedicationType,
    powderType: string | null,
    dosage: number | undefined,
    stock: number | undefined,
    modal: ModalManager
): MedicationType | undefined {
    const base = {
            medId: crypto.randomUUID(),
            medicationName,
            time,
            takenTimes: acceptedArray.length !== 0 ? acceptedArray : [],
            lastTakenUpdate: new Date().toISOString(),
        }
        switch (medType) {
            case SelectMedicationType.Pill:
                if (!dosage || !stock) return showError(modal)
                return { ...base, type: 'Таблетка', dosage, stock }
            case SelectMedicationType.Capsule:
                if (!dosage || !stock) return showError(modal)
                return { ...base, type: 'Капсула', dosage, stock }
            case SelectMedicationType.Mixture:
                if (!dosage) return showError(modal)
                return { ...base, type: 'Микстура', dosage }
            case SelectMedicationType.Drops:
                if (!dosage) return showError(modal)
                return { ...base, type: 'Капли', dosage }
            case SelectMedicationType.Aerosol:
                return { ...base, type: 'Аэрозоль' }
            case SelectMedicationType.Ointment:
                return { ...base, type: 'Мазь' }
            case SelectMedicationType.Powder:
                if (powderType === SelectPowderType.Sachet) {
                    if (!dosage || !stock) return showError(modal)
                    return { ...base, type: 'Порошок', dosageType: 'Пакетик', dosage, stock }
                } else {
                    if (!dosage) return showError(modal)
                    return { ...base, type: 'Порошок', dosageType: 'Ложка', dosage }
                }
        }
}

function showError(modal: ModalManager): undefined {
    modal.openModalWarning('Введите все значения')
    return
}

export function createTakenTimesArray(time: string[]): string[] {
    const times = getTimeReception(time)
    const now: Date = new Date()

    return times
        .filter(t => t.getTime() - now.getTime() <= 0)
        .map(t => t.toISOString())
}