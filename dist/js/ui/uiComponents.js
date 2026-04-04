import { formatDateRu, getWordForm, isDosageType } from "../core/timeUtils.js";
export function createDivContainer(styleClass, displayStyle) {
    const div = document.createElement('div');
    div.classList.add('container-cards-hidden', styleClass);
    div.style.display = displayStyle;
    return div;
}
export function createOpenCardsComponent(classStyle) {
    const button = document.createElement('button');
    button.classList.add('button-open-cards', classStyle);
    return button;
}
export function createDiseaseComponent(dis) {
    return `
    <li class="active__card">
        <div class="active__card-top-content">
        <h3 class="list-title" style="margin: 0;">${dis.diseaseName}</h3>
        <button class="item-button active__disease-delete" data-disId="${dis.id}">Удалить</button>
        </div>
        <p class="active__date">
            <span class="active__date--start">Назначен: ${formatDateRu(dis.dateStart)}</span>
            <span class="active__date--end">Окончание приёма: ${formatDateRu(dis.dateEnd)}</span>
        </p>
        ${dis.medArray.length > 0 ? dis.medArray.map(med => `<div class="active__med-content" data-id="${med.medId}" data-disease="${dis.id}"><h4 class="item-title active__med-title" data-id="${med.medId}">${med.medicationName} <img src="img/arrow-bottom.svg" alt="Стрелка вниз" style="width: 25px;"></h4></div>`).join('') : ''}
        </li>
    `;
}
export function createReceptionMainComponent(med, today) {
    let dosType;
    if (med.type !== 'Аэрозоль' && med.type !== 'Мазь') {
        dosType = isDosageType(med);
    }
    else {
        dosType = '';
    }
    return `
    <li class="reception-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        ${(med.type !== 'Аэрозоль' && med.type !== 'Мазь') ? `<p class="reception-list__dosage">${med.dosage} ${dosType}</p>` : '<p class="reception-list__dosage">По назначению</p>'}
        <p class="reception-list__time">${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}</p>
        <button class="item-button reception-list__button" data-id="${med.medId}" data-time="${today.toISOString()}">Принято</button>
        <span class="reception-list__stock">${med.type}</span>
    </li>
    `;
}
export function createMissedReceptionComponent(med, time) {
    let dosType;
    if (med.type !== 'Аэрозоль' && med.type !== 'Мазь') {
        dosType = isDosageType(med);
    }
    else {
        dosType = '';
    }
    return `
    <li class="missed-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        ${(med.type !== 'Аэрозоль' && med.type !== 'Мазь') ? `<p class="reception-list__dosage">${med.dosage} ${dosType}</p>` : '<p class="reception-list__dosage">По назначению</p>'}
        <p class="missed-list__time">${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}</p>
        <button class="item-button missed-list__button--check" data-id="${med.medId}" data-time="${time.toISOString()}">Принято</button>
        <button class="item-button missed-list__button" data-id="${med.medId}" data-time="${time.toISOString()}">Удалить из пропущенных</button>
    </li>
    `;
}
export function createStockReceptionComponent(med) {
    let word;
    let verb;
    if (med.type === 'Таблетка') {
        word = getWordForm(med.stock, 'таблетка', 'таблетки', 'таблеток', 'таблеток');
        verb = getWordForm(med.stock, 'Осталась', 'Осталось', 'Осталось', 'Осталось');
    }
    else if (med.type === 'Капсула') {
        word = getWordForm(med.stock, 'капсула', 'капсулы', 'капсул', 'капсул');
        verb = getWordForm(med.stock, 'Осталась', 'Осталось', 'Осталось', 'Осталось');
    }
    else if (med.type === 'Порошок' && med.dosageType === 'Пакетик' && med.stock !== undefined) {
        word = getWordForm(med.stock, 'порошок', 'порошка', 'порошков', 'порошков');
        verb = getWordForm(med.stock, 'Осталась', 'Осталось', 'Осталось', 'Осталось');
    }
    else {
        word = '';
        verb = '';
    }
    return `
    <li class="stock-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        <p class="stock-list__stock">${verb} ${med.stock} ${word}!!!</p>
    </li>
    `;
}
export function createArchiveCardComponent(disease) {
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
    `;
}
