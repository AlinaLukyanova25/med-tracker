export function getElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id)
    if (!el) throw new Error(`Элемент #${id} не найден`)
    return el as T
}

export function querySelectorEl<T extends HTMLElement>(selector: string): T {
    const el = document.querySelector(selector)
    if (!el) throw new Error(`Элемент "${selector}" не найден`)
    return el as T
}

export function isKeyOf<T extends object>(key: string | number | symbol, obj: T): key is keyof T {
  return key in obj;
}

export enum SelectMedicationType {
    Pill = 'Pill',
    Capsule = 'Capsule',
    Mixture = 'Mixture',
    Drops = 'Drops',
    Aerosol = 'Aerosol',
    Ointment = 'Ointment',
    Powder = 'Powder'
}

export enum SelectPowderType {
    Sachet = 'Sachet',
    Spoon = 'Spoon'
}

export enum DiseaseEditType {
    dateStart = 'dateStart',
    dateEnd = 'dateEnd',
    diseaseName = 'diseaseName'
}

export enum MedicationEditType {
    medicationName = 'medicationName',
    dosage = 'dosage',
    stock = 'stock',
    time = 'time'
}

export function isValidMedicationKey(key: string): key is MedicationEditType {
        return Object.values(MedicationEditType).includes(key as MedicationEditType)
    }

export function isValidDiseaseEditKey(key: string): key is DiseaseEditType {
    return Object.values(DiseaseEditType).includes(key as DiseaseEditType)
}