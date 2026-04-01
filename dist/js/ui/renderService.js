import { getTimeReception, formatDateRu } from "../core/timeUtils.js";
export function renderActiveList(arr, activeList) {
    activeList.innerHTML = '';
    if (arr.length === 0) {
        activeList.innerHTML = '<p class="item-title descr-not">Пока нет активных приёмов</p>';
        return;
    }
    for (let dis of arr) {
        if (dis.archive)
            continue;
        const li = createDiseaseComponent(dis);
        activeList.insertAdjacentHTML('beforeend', li);
    }
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
        ${dis.medArray.length > 0 ? dis.medArray.map(med => `<div class="active__med-content" data-id="${med.medId}" data-disease="${dis.id}"><h4 class="item-title active__med-title" data-id="${med.medId}">${med.medicationName} 🔽</h4></div>`).join('') : ''}
        </li>
    `;
}
export function renderReceptionList(arr, receptionList, missedList, medications) {
    const now = new Date();
    receptionList.innerHTML = '';
    missedList.innerHTML = '';
    const sorted = sortByOrderHours(arr, medications);
    let rec = 0;
    let mis = 0;
    for (let med of sorted) {
        const diff = (med.time.getTime() + 900000) - now.getTime();
        if (diff > 0) {
            const li = createReceptionMainComponent(med.medication, med.time);
            receptionList.insertAdjacentHTML('beforeend', li);
            rec++;
        }
        else {
            const li = createMissedReceptionComponent(med.medication, med.time);
            missedList.insertAdjacentHTML('beforeend', li);
            mis++;
        }
    }
    if (rec === 0)
        receptionList.innerHTML = '<p>На сегодня приёмов нет<p>';
    if (mis === 0)
        missedList.innerHTML = '<p>На сегодня нет пропущенных приёмов</p>';
}
export function renderStockList(arr, stockList, medications) {
    stockList.innerHTML = '';
    const sorted = sortStock(arr, medications);
    let stock = 0;
    for (const med of sorted) {
        const li = createStockReceptionComponent(med);
        stockList.insertAdjacentHTML('beforeend', li);
        stock++;
    }
    if (stock === 0)
        stockList.innerHTML = 'Пока ничего нет';
}
function createReceptionMainComponent(med, today) {
    return `
    <li class="reception-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        <p class="reception-list__dosage">${med.dosage} мг.</p>
        <p class="reception-list__time">${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}</p>
        <button class="item-button reception-list__button" data-id="${med.medId}" data-time="${today.toISOString()}">Принято</button>
        <span class="reception-list__stock">Осталось таблеток: ${med.stock}</span>
    </li>
    `;
}
function createMissedReceptionComponent(med, time) {
    return `
    <li class="missed-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        <p class="missed-list__dosage">${med.dosage} мг.</p>
        <p class="missed-list__time">${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}</p>
        <button class="item-button missed-list__button" data-id="${med.medId}" data-time="${time.toISOString()}">Удалить из пропущенных</button>
    </li>
    `;
}
function createStockReceptionComponent(med) {
    return `
    <li class="stock-list__item">
        <h4 class="item-title">${med.medicationName}</h4>
        <p class="stock-list__stock">Осталось ${med.stock} таблеток!!!</p>
    </li>
    `;
}
export function renderArchiveList(arr, archiveList) {
    archiveList.innerHTML = '';
    if (arr.length === 0 || arr.filter(d => d.archive).length === 0) {
        archiveList.innerHTML = '<p class="item-title descr-not">Пока нет архивных приёмов</p>';
        return;
    }
    for (let disease of arr) {
        if (!disease.archive)
            continue;
        const li = createArchiveCardComponent(disease);
        archiveList.insertAdjacentHTML('beforeend', li);
    }
}
function createArchiveCardComponent(disease) {
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
function sortByOrderHours(arr, medications) {
    const newArr = medications;
    const sortedArr = [];
    for (let medication of newArr) {
        const result = getTimeReception(medication.time);
        for (let time of result) {
            if (medication.takenTimes.includes(time.toISOString()))
                continue;
            const medAndTime = {
                time: time,
                medication: medication,
            };
            sortedArr.push(medAndTime);
        }
    }
    return sortedArr.sort((a, b) => a.time.getTime() - b.time.getTime());
}
function sortStock(arr, medication) {
    const items = medication
        .filter(med => med.stock <= 5)
        .sort((a, b) => a.stock - b.stock);
    return items;
}
