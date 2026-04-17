import { MedicationType } from './data';
import { DiseaseEditType, MedicationEditType } from './types';

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

export interface InputDataMed<T> {
  id: string;
  typeofId: 'string';
  property: MedicationEditType;
  newValue: T;
}

type Delete = 'active' | 'edit';

export type DeleteDiseaseButton = `.${Delete}__disease-delete`;

export type DeleteMedButton = `.${Delete}__medication-delete`;

export type ModalType = 'modal' | 'again';

export type ButtonOpenCardClass =
  | 'reception-list__open-card'
  | 'missed-list__open-card'
  | 'stock-list__open-card';

export type DivHiddenClass<T extends ButtonOpenCardClass> =
  `${T extends `${infer Prifix}__open-card`
    ? `${Prifix}__card-hidden`
    : never}`;

export type PluralRule = 'one' | 'few' | 'many' | 'other';
