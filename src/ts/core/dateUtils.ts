import { ModalManager } from '../managers/modal';
import { PluralRule } from '../types/ui';
import { querySelectorEl } from '../types/types.js';

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
};

export function getTimeReception(time: string[], date = new Date()): Date[] {
  return time.map(
    (t) =>
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(t.slice(0, 2)),
        Number(t.slice(3))
      )
  );
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
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  return d2 > d1;
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
  const now = new Date();
  const timeDate = new Date(time);

  if (!timeDate) return false;

  return timeDate.getTime() - now.getTime() < 900000;
}

export function parseRussianDate(
  input: HTMLInputElement,
  property: 'dateStart' | 'dateEnd',
  id: string,
  modal: ModalManager
): boolean | string {
  const value = input.value;
  if (value.length > 11) {
    modal.openModalWarning('Введите корректные данные', undefined, input);
    return false;
  }

  const monthNames = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const monthInInput = monthNames.find((m) => value.toLowerCase().includes(m));

  if (!monthInInput) {
    modal.openModalWarning(
      'Введите правильное значение месяца',
      undefined,
      input
    );
    return false;
  }

  const dateArray = value.split(' ');

  const newValue = `${new Date().getFullYear()}-${String(monthNames.findIndex((m) => m === monthInInput) + 1).padStart(2, '0')}-${String(dateArray[0]).padStart(2, '0')}`;

  if (isNaN(new Date(newValue).getTime())) {
    modal.openModalWarning('Введите корректную дату', undefined, input);
    return false;
  }

  if (property === 'dateEnd' && isDatePassed(new Date(newValue))) {
    modal.openModalWarning(
      'Дата окончания не может быть прошедшей',
      undefined,
      input
    );
    return false;
  }

  const otherInput = querySelectorEl(
    `input[data-property="${
      property === 'dateStart' ? 'dateEnd' : 'dateStart'
    }"][data-object-id="${id}"]`,
    HTMLInputElement
  );

  const otherDateArray = otherInput.value.split(' ');

  const otherDate = `${new Date().getFullYear()}-${String(monthNames.findIndex((m) => m === otherDateArray[1]) + 1).padStart(2, '0')}-${String(otherDateArray[0]).padStart(2, '0')}`;

  if (isNaN(new Date(otherDate).getTime())) {
    modal.openModalWarning(
      'Невозможно сравнивать с некорректной датой',
      undefined,
      otherInput
    );
    return false;
  }

  if (
    property === 'dateStart' &&
    isDatePassed(new Date(otherDate), new Date(newValue))
  ) {
    modal.openModalWarning(
      'Дата назначения не может быть больше даты окончания',
      undefined,
      input
    );
    return false;
  }
  if (
    property === 'dateEnd' &&
    !isDatePassed(new Date(otherDate), new Date(newValue))
  ) {
    modal.openModalWarning(
      'Дата окончания не может быть меньше даты назначения',
      undefined,
      input
    );
    return false;
  }

  return newValue;
}

export function createTakenTimesArray(time: string[]): string[] {
  const times = getTimeReception(time);
  const now: Date = new Date();

  return times
    .filter((t) => t.getTime() - now.getTime() <= 0)
    .map((t) => t.toISOString());
}

if (!globalThis.Intl) {
  globalThis.Intl = Intl;
}

const formatter = new Intl.PluralRules('ru');

export function getWordForm(
  count: number,
  one: string,
  few: string,
  many: string,
  other: string
): string {
  const rawRule = formatter.select(count);

  const isValidRule = (rule: unknown): rule is PluralRule =>
    rule === 'one' || rule === 'few' || rule === 'many' || rule === 'other';

  if (!isValidRule(rawRule)) {
    return other;
  }

  const rule: PluralRule = rawRule;

  const forms: Record<PluralRule, string> = {
    one,
    few,
    many,
    other,
  };
  return forms[rule];
}
