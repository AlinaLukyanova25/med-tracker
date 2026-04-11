// import { data, ui } from "../types/common"
import { Disease, MedicationType, Pill, Capsule, Powder } from "../types/data"
import { formatDateRu, getWordForm, isDosageType } from "../core/timeUtils.js"
import { SelectMedicationType, SelectPowderType } from "../types/types.js"

export function createDivContainer(styleClass: string, displayStyle: string): HTMLDivElement {
    const div = document.createElement('div')
    div.classList.add('container-cards-hidden', styleClass)
    div.style.display = displayStyle
    return div
}

export function createOpenCardsComponent(classStyle: string): HTMLButtonElement {
    const button = document.createElement('button')
    button.classList.add('button-open-cards', classStyle)
    return button
}

export function createDiseaseComponent(dis: Disease): string {
    return `
    <li class="active__card" data-dis="${dis.id}">
        <div class="active__card-top-content">
        <h3 class="list-title" style="margin: 0;">${dis.diseaseName}</h3>
        <button class="item-button active__disease-delete" data-dis="${dis.id}">Удалить</button>
        </div>
        <p class="active__date">
            <span class="active__date--start">Назначен: ${formatDateRu(dis.dateStart)}</span>
            <span class="active__date--end">Окончание приёма: ${formatDateRu(dis.dateEnd)}</span>
        </p>
        ${dis.medArray.length > 0 ? dis.medArray.map(med => `<div class="active__med-content" data-id="${med.medId}" data-disease="${dis.id}"><h4 class="item-title active__med-title" data-id="${med.medId}">${med.medicationName} <img src="img/arrow-bottom.svg" alt="Стрелка вниз" style="width: 25px;"></h4></div>`).join('') : ''}
        </li>
    `
}

export function createMedicationComponent(med: MedicationType): string {
    let dosType: string
    if (med.type !== 'Аэрозоль' && med.type !== 'Мазь') {
        dosType = isDosageType(med)
    } else {
        dosType = ''
    }
        
    return `
    <h4 class="item-title active__med-title open" data-id="${med.medId}">${med.medicationName} <img src="img/arrow-top.svg" alt="Стрелка вверх" style="width: 25px;"></h4>
    <div class="active__card-bottom">
        ${(med.type !== 'Аэрозоль' && med.type !== 'Мазь') ? `<p class="active__dosage">Доза: <span>${med.dosage} ${dosType}</span></p>` : ''}
        ${(med.type === 'Таблетка' || med.type === 'Капсула' || med.type === 'Порошок' && med.dosageType === 'Пакетик') ? `<p class="active__stock">Осталось: <span>${med.stock}</span></p>` : ''}
        <p class="active__time">Время приёма: <span>${med.time.join(', ')}</span></p>
        <button class="card-button active__medication-delete" data-id="${med.medId}">Удалить приём</button>
    </div>
    `
}

export function createReceptionMainComponent(med: MedicationType, today: Date): string {
    let dosType: string
        if (med.type !== 'Аэрозоль' && med.type !== 'Мазь') {
            dosType = isDosageType(med)
        } else {
            dosType = ''
        }
    return `
    <li class="reception-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        ${(med.type !== 'Аэрозоль' && med.type !== 'Мазь') ? `<p class="reception-list__dosage">${med.dosage} ${dosType}</p>` : '<p class="reception-list__dosage">По назначению</p>'}
        <p class="reception-list__time">${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}</p>
        <button class="item-button reception-list__button" data-id="${med.medId}" data-time="${today.toISOString()}">Принято</button>
        <span class="reception-list__stock">${med.type}</span>
    </li>
    `
}

export function createMissedReceptionComponent(med: MedicationType, time: Date): string {
    let dosType: string
        if (med.type !== 'Аэрозоль' && med.type !== 'Мазь') {
            dosType = isDosageType(med)
        } else {
            dosType = ''
        }
    return `
    <li class="missed-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        ${(med.type !== 'Аэрозоль' && med.type !== 'Мазь') ? `<p class="reception-list__dosage">${med.dosage} ${dosType}</p>` : '<p class="reception-list__dosage">По назначению</p>'}
        <p class="missed-list__time">${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}</p>
        <button class="item-button missed-list__button--check" data-id="${med.medId}" data-time="${time.toISOString()}">Принято</button>
        <button class="item-button missed-list__button" data-id="${med.medId}" data-time="${time.toISOString()}">Удалить из пропущенных</button>
    </li>
    `
}

export function createStockReceptionComponent(med: Extract<MedicationType, Pill | Capsule | Powder<'Пакетик'>>): string {
    let word: string
    let verb: string
    if (med.type === 'Таблетка') {
        word = getWordForm(med.stock, 'таблетка', 'таблетки', 'таблеток', 'таблеток')
        verb = getWordForm(med.stock, 'Осталась', 'Осталось', 'Осталось', 'Осталось')
    } else if (med.type === 'Капсула') {
        word = getWordForm(med.stock, 'капсула', 'капсулы', 'капсул', 'капсул')
        verb = getWordForm(med.stock, 'Осталась', 'Осталось', 'Осталось', 'Осталось')
    } else if (med.type === 'Порошок' && med.dosageType === 'Пакетик' && med.stock !== undefined) {
        word = getWordForm(med.stock, 'порошок', 'порошка', 'порошков', 'порошков');
        verb = getWordForm(med.stock, 'Остался', 'Осталось', 'Осталось', 'Осталось')
    } else {
        word = ''
        verb = ''
    }

    return `
    <li class="stock-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        <p class="stock-list__stock">${verb} ${med.stock} ${word}!!!</p>
        <button class="dark-button stock-list__button" data-id="${med.medId}">Пополнить</button>
    </li>
    `
}

export function createArchiveCardComponent(disease: Disease): string {
    return `
    <li class="archive__card">
        <h3 class="list-title">${disease.diseaseName}</h3>
        ${disease.medArray.length > 0 ? disease.medArray.map(med => `<div data-id="${med.medId}" data-disease="${disease.id}"><h4 class="item-title" data-id="${med.medId}">${med.medicationName}</h4></div>`).join('') : ''}
        <div class="archive__card-bottom">
            <p class="archive__date">Завершен: ${formatDateRu(disease.dateEnd)}</p>
            <button class="item-button archive__btn-return" data-id="${disease.id}">Назначить снова</button>
            <button class="item-button archive__card-delete" data-id="${disease.id}">Удалить</button>
        </div>
    </li>
    `
}

export function createEditContainerComponent(dis: Disease): string {
        return `
        <div class="edit">
            <button class="arrow arrow-back">
                <img src="img/arrow-left.svg" alt="Вернуться назад">
            </button>
            <form id="edit-form" class="edit__form">
            <div class="edit__top-content">
                <textarea class="list-title" 
                data-property="diseaseName"
                data-object-id="${dis.id}"
                data-typeof-id="number"
                style="margin: 0;"
                >${dis.diseaseName}</textarea>
                <button class="item-button edit__disease-delete" data-dis="${dis.id}">Удалить</button>
            </div>
            <div class="edit__date">
                <div class="edit__input-container edit__date--start">Назначен:<input type="text" value="${formatDateRu(dis.dateStart)}"
                data-property="dateStart"
                data-object-id="${dis.id}"
                data-typeof-id="number"
                ></div>
                <div class="edit__input-container edit__date--end">Окончание приёма:<input type="text" value="${formatDateRu(dis.dateEnd)}"
                data-property="dateEnd"
                data-object-id="${dis.id}"
                data-typeof-id="number"
                ></div>
            </div>
            </form>

        <ul class="edit__list">
        ${dis.medArray.length > 0 ? dis.medArray.map(med => createEditMedicationComponent(med)).join('') : ''}
        </ul>
        <button class="edit__add-button">+</button>

        <button class="item-button edit__save-btn" data-dis="${dis.id}">Сохранить изменения</button>
        </div>
        `
}

export function createEditMedicationComponent(med: MedicationType): string {
        return `
        <li class="edit__item">
            <textarea class="item-title"
            data-property="medicationName"
                data-object-id="${med.medId}"
                data-typeof-id="string"
            >${med.medicationName}</textarea>
            <form class="edit__form-item">
                <div class="edit__card-top-content">
                ${med.type !== 'Аэрозоль' && med.type !== 'Мазь' ? `<div class="edit__input-container edit__dosage">Доза: <input type="number" value="${med.dosage}" min="0" step="0.1"
                data-property="dosage"
                data-object-id="${med.medId}"
                data-typeof-id="string"
                ><span class="edit__dosage-type">${isDosageType(med)}</span></div>` : ''} 
                ${med.type === 'Таблетка' || med.type === 'Капсула' || (med.type === 'Порошок' && med.dosageType === 'Пакетик') ? `<div class="edit__input-container edit__stock">Осталось: <input type="number" value="${med.stock}" min="1"
                data-property="stock"
                data-object-id="${med.medId}"
                data-typeof-id="string"
                ></div>` : ''}
                </div>

                <div class="edit__card-bottom">
                <div class="edit__input-container edit__time">Время приёма: <input type="text" value="${med.time.length > 0 ? med.time.join(', ') : ''}"
                data-property="time"
                data-object-id="${med.medId}"
                data-typeof-id="string"
                ></div>
                <button class="card-button edit__medication-delete" data-id="${med.medId}">Удалить приём</button>
                </div>
            </form>
        </li>
        `
}

export function createChooseTypeMedComponent(): string {
    return `
    <li class="edit__item edit__item--choose">
    <button class="dark-button edit__button-choose" data-type="Pill">Таблетка</button>
    <button class="dark-button edit__button-choose" data-type="Capsule">Капсула</button>
    <button class="dark-button edit__button-choose" data-type="Mixture">Микстура</button>
    <button class="dark-button edit__button-choose" data-type="Drops">Капли</button>
    <button class="dark-button edit__button-choose" data-type="Aerosol">Аэрозоль</button>
    <button class="dark-button edit__button-choose" data-type="Ointment">Мазь</button>
    <button class="dark-button edit__button-choose" data-type="Powder" data-potype="Sachet">Порошок (сашет)</button>
    <button class="dark-button edit__button-choose" data-type="Powder" data-potype="Spoon">Порошок (мер. ложка)</button>
    </li>
    `
}

export function createEditAddComponent(type: SelectMedicationType, powderType: string | undefined): string {
    let html = ''
    switch (type) {
        case SelectMedicationType.Pill:
            html = `
            <div class="edit__card-top-content">
            <div class="edit__input-container edit__dosage">Доза: <input type="number" min="0" step="0.1" id="edit-dosage"><span class="edit__dosage-type">таб.</span></div>
            <div class="edit__input-container edit__stock">Запас лекарства (шт.): <input type="number" min="1" id="edit-stock"></div>
            </div>
            `
            break
        case SelectMedicationType.Capsule:
            html = `
            <div class="edit__card-top-content">
            <div class="edit__input-container edit__dosage">Доза: <input type="number" min="0" step="0.1" id="edit-dosage"><span class="edit__dosage-type">капс.</span></div>
            <div class="edit__input-container edit__stock">Запас лекарства (шт.): <input type="number" min="1" id="edit-stock"></div>
            </div>
            `
            break
        case SelectMedicationType.Mixture:
            html = `
            <div class="edit__card-top-content">
            <div class="edit__input-container edit__dosage">Доза: <input type="number" min="0" step="0.1" id="edit-dosage"><span class="edit__dosage-type">мер. лож.</span></div>
            </div>
            `
            break
        case SelectMedicationType.Drops:
            html = `
            <div class="edit__card-top-content">
            <div class="edit__input-container edit__dosage">Доза: <input type="number" min="0" step="0.1" id="edit-dosage"><span class="edit__dosage-type">кап.</span></div>
            </div>
            `
            break
        case SelectMedicationType.Powder:
            if (powderType === SelectPowderType.Sachet) {
                html = `
                <div class="edit__card-top-content">
                <div class="edit__input-container edit__dosage">Доза: <input type="number" min="0" step="0.1" id="edit-dosage"><span class="edit__dosage-type">саш.</span></div>
                <div class="edit__input-container edit__stock">Запас лекарства (шт.): <input type="number" min="1" id="edit-stock"></div>
                </div>
                `
            } else {
                html = `
                <div class="edit__card-top-content">
                <div class="edit__input-container edit__dosage">Доза: <input type="number" min="0" step="0.1" id="edit-dosage"><span class="edit__dosage-type">мер. лож.<span></div>
                </div>
                `
            }
            break
        default:
            break
    }

    return `
        <form class="edit__form-add">
        <textarea class="item-title" id="med-title">Название лекарства</textarea>
        ${html}

        <div class="edit__card-bottom">
            <div class="edit__input-container edit__time">Время приёма: <input type="text" id="edit-time"></div>
        </div>
        <button type="submit" class="edit__submit-btn">Добавить лекарство</button>
        </form>
    `
}
