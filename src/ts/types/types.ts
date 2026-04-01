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

export interface Disease {
    readonly id: number;
    readonly diseaseName: string;
    dateStart: Date;
    dateEnd: Date;
    archive: boolean;
    medArray: Medication[];
}

export interface Medication {
    readonly medId: string;
    medicationName: string;
    time: string[];
    dosage: number;
    stock: number;
    takenTimes: string[];
    lastTakenUpdate: string;
}

export interface SortedMedication {
    time: Date;
    medication: Medication;
}

export type ModalType = "modal" | "again"