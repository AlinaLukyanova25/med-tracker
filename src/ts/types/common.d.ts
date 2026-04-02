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

export type ButtonOpenCardClass = 'reception-list__open-card' | 'missed-list__open-card' | 'stock-list__open-card'

export type DivHiddenClass<T extends ButtonOpenCardClass> = `${T extends `${infer Prifix}__open-card`
    ? `${Prifix}__card-hidden`
    : never}`


export type PluralRule = 'one' | 'few' | 'many' | 'other';