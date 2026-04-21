import { MedicationType, Aerosol, Ointment, DosageType } from './data';
import { ModalManager } from '../managers/modal';

export function getElement<T extends HTMLElement>(
  id: string,
  typeGuard: new (...args: unknown[]) => T
): T {
  const el = document.getElementById(id);

  if (!el) throw new Error(`Элемент #${id} не найден`);

  if (!(el instanceof typeGuard)) {
    throw new Error(
      `Найденный элемент "${id}" не соответствует ожидаемому типу ${typeGuard.name}`
    );
  }

  return el;
}

export function querySelectorEl<T extends HTMLElement>(
  selector: string,
  typeGuard: new (...args: unknown[]) => T
): T {
  const el = document.querySelector(selector);

  if (!el) throw new Error(`Элемент "${selector}" не найден`);

  if (!(el instanceof typeGuard)) {
    throw new Error(
      `Найденный элемент "${selector}" не соответствует ожидаемому типу ${typeGuard.name}`
    );
  }

  return el;
}

export enum SelectMedicationType {
  Pill = 'Pill',
  Capsule = 'Capsule',
  Mixture = 'Mixture',
  Drops = 'Drops',
  Aerosol = 'Aerosol',
  Ointment = 'Ointment',
  Powder = 'Powder',
}

export enum SelectPowderType {
  Sachet = 'Sachet',
  Spoon = 'Spoon',
}

export enum DiseaseEditType {
  dateStart = 'dateStart',
  dateEnd = 'dateEnd',
  diseaseName = 'diseaseName',
}

export enum MedicationEditType {
  medicationName = 'medicationName',
  dosage = 'dosage',
  stock = 'stock',
  time = 'time',
}

export function isValidMedicationKey(key: string): key is MedicationEditType {
  return Object.values(MedicationEditType).includes(key as MedicationEditType);
}

export function isValidDiseaseEditTypeKey(key: string): key is DiseaseEditType {
  return Object.values(DiseaseEditType).includes(key as DiseaseEditType);
}

export function isValidMedicationType(
  value: string | null
): value is SelectMedicationType {
  if (!value) return false;
  return Object.values(SelectMedicationType).includes(
    value as SelectMedicationType
  );
}

export function isDosageType(
  med: Exclude<MedicationType, Aerosol | Ointment>
): DosageType {
  let dosType: DosageType;
  switch (med.type) {
    case 'Таблетка':
      dosType = 'таб.';
      break;
    case 'Капсула':
      dosType = 'капс.';
      break;
    case 'Микстура':
      dosType = 'мер. лож.';
      break;
    case 'Капли':
      dosType = 'кап.';
      break;
    case 'Порошок':
      dosType = med.dosageType === 'Пакетик' ? 'саш.' : 'мер. лож.';
      break;
  }
  return dosType;
}

export function collectsObjectByType(
  medicationName: string,
  time: string[],
  acceptedArray: string[],
  medType: SelectMedicationType,
  powderType: string | null,
  dosage: number | null,
  stock: number | null,
  modal: ModalManager
): MedicationType | 'dosage' | 'stock' {
  const base = {
    medId: crypto.randomUUID(),
    medicationName,
    time,
    takenTimes: acceptedArray.length !== 0 ? acceptedArray : [],
    lastTakenUpdate: new Date().toISOString(),
  };

  switch (medType) {
    case SelectMedicationType.Pill:
      if (!dosage) return 'dosage';
      if (!stock) return 'stock';
      return { ...base, type: 'Таблетка', dosage, stock };
    case SelectMedicationType.Capsule:
      if (!dosage) return 'dosage';
      if (!stock) return 'stock';
      return { ...base, type: 'Капсула', dosage, stock };
    case SelectMedicationType.Mixture:
      if (!dosage) return 'dosage';
      return { ...base, type: 'Микстура', dosage };
    case SelectMedicationType.Drops:
      if (!dosage) return 'dosage';
      return { ...base, type: 'Капли', dosage };
    case SelectMedicationType.Aerosol:
      return { ...base, type: 'Аэрозоль' };
    case SelectMedicationType.Ointment:
      return { ...base, type: 'Мазь' };
    case SelectMedicationType.Powder:
      if (powderType === SelectPowderType.Sachet) {
        if (!dosage) return 'dosage';
        if (!stock) return 'stock';
        return {
          ...base,
          type: 'Порошок',
          dosageType: 'Пакетик',
          dosage,
          stock,
        };
      } else {
        if (!dosage) return 'dosage';
        return { ...base, type: 'Порошок', dosageType: 'Ложка', dosage };
      }
  }
}
