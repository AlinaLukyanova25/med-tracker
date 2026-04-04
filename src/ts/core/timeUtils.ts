import { Aerosol, DosageType, Medication, MedType, Ointment, PluralRule, PowderDosageType, MedicationType } from "../types/common"

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

export function shouldUpdateTaken(med: MedicationType): boolean {
    const lastUpdate = new Date(med.lastTakenUpdate);
    const today = new Date();
        
    return (
        lastUpdate.getFullYear() !== today.getFullYear() ||
        lastUpdate.getMonth() !== today.getMonth() ||
        lastUpdate.getDate() !== today.getDate()
    );
}

export function isDatePassed(date1: Date): boolean {
    const d1 = new Date(date1)
    const d2 = new Date()

    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)

    return d2 > d1
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