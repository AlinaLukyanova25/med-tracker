export interface Disease {
    readonly id: number;
    diseaseName: string;
    dateStart: Date;
    dateEnd: Date;
    archive: boolean;
    medArray: MedicationType[];
}

export interface Medication {
    readonly medId: string;
    medicationName: string;
    type: MedType
    time: string[];
    takenTimes: string[];
    lastTakenUpdate: string;
}

export interface Pill extends Medication {
    type: 'Таблетка';
    stock: number;
    dosage: number;
}

export interface Capsule extends Medication {
    type: 'Капсула'
    stock: number;
    dosage: number;
}

export interface Mixture extends Medication {
    type: 'Микстура';
    dosage: number;
}

export interface Drops extends Medication {
    type: 'Капли';
    dosage: number;
}

export interface Aerosol extends Medication {
    type: 'Аэрозоль';
}

export interface Ointment extends Medication {
    type: 'Мазь';
}

export interface Powder<T extends PowderDosageType> extends Medication {
    type: 'Порошок';
    dosageType: T;
    dosage: number;
    stock?:  StockType<T>;
}

type PowderDosageType = 'Пакетик' | 'Ложка'

type StockType<T> = T extends 'Пакетик' ? number : never

export type MedType = 'Таблетка' | 'Капсула' | 'Микстура' | 'Капли' | 'Аэрозоль' | 'Мазь' | 'Порошок'

export type DosageType = 'таб.' | 'капс.' | 'мер. лож.' | 'кап.' | 'саш.'

export type MedicationType = Pill | Capsule | Mixture | Drops | Aerosol | Ointment | Powder<'Пакетик'> | Powder<'Ложка'>;

export interface StoredDisease {
    readonly id: number;
    diseaseName: string;
    archive: boolean;
    medArray: MedicationType[];
    dateStart: string;
    dateEnd: string;
}