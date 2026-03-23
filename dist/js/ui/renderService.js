import { getTimeReception, formatDateRu } from "../core/timeUtils.js";
export function renderActiveList(arr, activeList) {
    activeList.innerHTML = '';
    if (arr.length === 0) {
        activeList.innerHTML = '<p class="item-title descr-not">Пока нет активных приёмов</p>';
        return;
    }
    for (let reception of arr) {
        if (reception.archive)
            continue;
        const li = createReceptionComponent(reception);
        activeList.insertAdjacentHTML('beforeend', li);
    }
}
export function createReceptionComponent(reception) {
    return `
    <li class="active__card">
        <h3 class="list-title">${reception.diseaseName}</h3>
        <h4 class="item-title">${reception.medicationName}</h4>
        <p class="active__date">
            <span class="active__date--start">Назначен: ${formatDateRu(reception.dateStart)}</span>
            <span class="active__date--end">Окончание приёма: ${formatDateRu(reception.dateEnd)}</span>
        </p>
        <div class="active__card-bottom">
            <p class="active__dosage">Доза: <span>${reception.dosage} мг.</span></p>
            <p class="active__time">Время приёма: <span>${reception.time.join(', ')}</span></p>
            <button class="item-button active__card-delete" data-id="${reception.id}">Удалить приём</button>
        </div>
    </li>
    `;
}
export function renderReceptionList(arr, receptionList, missedList) {
    const now = new Date();
    receptionList.innerHTML = '';
    missedList.innerHTML = '';
    for (let reception of arr) {
        if (reception.taken)
            continue;
        if (reception.archive)
            continue;
        const result = getTimeReception(reception.time);
        let today = result.length > 1 ? result.find(t => {
            if ((t.getTime() - now.getTime()) > 0)
                return t;
        }) : result[0];
        if (!today)
            continue;
        const diff = today.getTime() - now.getTime();
        if (diff > 0) {
            const li = createReceptionMainComponent(reception);
            receptionList.insertAdjacentHTML('beforeend', li);
        }
        else {
            const li = createMissedReceptionComponent(reception);
            missedList.insertAdjacentHTML('beforeend', li);
        }
    }
}
export function renderStockList(arr, stockList) {
    stockList.innerHTML = '';
    if (arr.length === 0)
        return;
    const now = new Date();
    for (const reception of arr) {
        if (reception.archive)
            continue;
        if (reception.stock <= 5) {
            const li = createStockReceptionComponent(reception);
            stockList.insertAdjacentHTML('beforeend', li);
        }
    }
}
function createReceptionMainComponent(reception) {
    return `
    <li class="reception-list__item">
        <h4 class="item-title">${reception.medicationName}</h4>
        <p class="reception-list__dosage">${reception.dosage} мг.</p>
        <p class="reception-list__time">${reception.time.join(', ')}</p>
        <button class="item-button reception-list__button" data-id="${reception.id}">Принято</button>
        <span class="reception-list__stock">Осталось таблеток: ${reception.stock}</span>
    </li>
    `;
}
function createMissedReceptionComponent(reception) {
    return `
    <li class="missed-list__item">
        <h4 class="item-title">${reception.medicationName}</h4>
        <p class="missed-list__dosage">${reception.dosage} мг.</p>
        <p class="missed-list__time">${reception.time.join(', ')}</p>
        <button class="item-button missed-list__button" data-id="${reception.id}">Удалить из пропущенных</button>
    </li>
    `;
}
function createStockReceptionComponent(reception) {
    return `
    <li class="stock-list__item">
        <h4 class="item-title">${reception.medicationName}</h4>
        <p class="stock-list__stock">Осталось ${reception.stock} таблеток!!!</p>
    </li>
    `;
}
export function renderArchiveList(arr, archiveList) {
    archiveList.innerHTML = '';
    if (arr.length === 0) {
        archiveList.innerHTML = '<p class="item-title descr-not">Пока нет архивных приёмов</p>';
        return;
    }
    for (let reception of arr) {
        if (!reception.archive)
            continue;
        const li = createArchiveCardComponent(reception);
        archiveList.insertAdjacentHTML('beforeend', li);
    }
}
function createArchiveCardComponent(reception) {
    return `
    <li class="archive__card">
        <h3 class="list-title">${reception.diseaseName}</h3>
        <h4 class="item-title">${reception.medicationName}</h4>
        <div class="archive__card-bottom">
            <p class="archive__date">Завершен: ${formatDateRu(reception.dateEnd)}</p>
            <button class="item-button archive__btn-return" data-id="${reception.id}">Назначить снова</button>
            <button class="item-button archive__card-delete" data-id="${reception.id}">Удалить</button>
        </div>
    </li>
    `;
}
