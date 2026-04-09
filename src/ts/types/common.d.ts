// Основная структура

import { DiseaseEditType, MedicationEditType } from "./types";

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

// Вспомогательные типы

type PowderDosageType = 'Пакетик' | 'Ложка'

type StockType<T> = T extends 'Пакетик' ? number : never

export type MedType = 'Таблетка' | 'Капсула' | 'Микстура' | 'Капли' | 'Аэрозоль' | 'Мазь' | 'Порошок'

export type DosageType = 'таб.' | 'капс.' | 'мер. лож.' | 'кап.' | 'саш.'

export type MedicationType = Pill | Capsule | Mixture | Drops | Aerosol | Ointment | Powder<'Пакетик'> | Powder<'Ложка'>;

export interface SortedMedication {
    time: Date;
    medication: MedicationType;
}

export interface MarkedDates {
    date: string;
    taken: boolean;
    lastTakenUpdate: string;
}

export interface InputDataDis<T> {
    id: string;
    typeofId: 'number';
    property: DiseaseEditType;
    newValue: T;
}

export interface DiseaseEdit {
    diseaseName: string;
    dateStart: Date;
    dateEnd: Date;
}

export interface MedicationEdit {
    medicationName: string;
    time: string[];
    stock: number;
    dosage: number;
    takenTimes: string[];
}

export interface InputDataMed<T> {
    id: string;
    typeofId: 'string';
    property: MedicationEditType;
    newValue: T;
}

type Delete = 'active' | 'edit'

export type DeleteDiseaseButton = `.${Delete}__disease-delete`

export type DeleteMedButton = `.${Delete}__medication-delete`

// Элементы страницы

export type ModalType = "modal" | "again"

export type ButtonOpenCardClass = 'reception-list__open-card' | 'missed-list__open-card' | 'stock-list__open-card'

export type DivHiddenClass<T extends ButtonOpenCardClass> = `${T extends `${infer Prifix}__open-card`
    ? `${Prifix}__card-hidden`
    : never}`


export type PluralRule = 'one' | 'few' | 'many' | 'other';