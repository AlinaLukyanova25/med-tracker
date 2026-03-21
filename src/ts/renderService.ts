import { Reception } from "./types.js"
import { getTimeReception, isDatePassed } from "./timeUtils.js"

export function renderReceptionList(arr: Reception[], receptionList: HTMLUListElement, missedList: HTMLUListElement): void {

    const now: Date = new Date()

    receptionList.innerHTML = ''
    missedList.innerHTML = ''

    for (let reception of arr) {
        if (reception.taken) continue
        if (isDatePassed(reception.dateEnd, now)) continue

        const result = getTimeReception(reception.time)

        let today = result.length > 1 ? result.find(t => {
            if ((t.getTime() - now.getTime()) > 0) return t
        }) : result[0];

        if (!today) continue

        const diff = today.getTime() - now.getTime()

        if (diff > 0) {
            const li = createReceptionComponent(reception)
            receptionList.insertAdjacentHTML('beforeend', li)
        } else {
            const li = createMissedReceptionComponent(reception)
            missedList.insertAdjacentHTML('beforeend', li)
        }
    }
}

export function renderStockList(arr: Reception[], stockList: HTMLUListElement): void {
    stockList.innerHTML = ''

    if (arr.length === 0) return

    for (const reception of arr) {
        if (reception.stock <= 5) {
            const li = createStockReceptionComponent(reception)
            stockList.insertAdjacentHTML('beforeend', li)
        }
    }
}

function createReceptionComponent(reception: Reception): string {
    return `
    <li class="reception-list__item">
        <h4 class="item-title">${reception.medicationName}</h4>
        <p class="reception-list__dosage">${reception.dosage} мг.</p>
        <p class="reception-list__time">${reception.time.join(', ')}</p>
        <button class="item-button reception-list__button" data-id="${reception.id}">Принято</button>
        <span class="reception-list__stock">Осталось таблеток: ${reception.stock}</span>
    </li>
    `
}

function createMissedReceptionComponent(reception: Reception): string {
    return `
    <li class="missed-list__item">
        <h4 class="item-title">${reception.medicationName}</h4>
        <p class="missed-list__dosage">${reception.dosage} мг.</p>
        <p class="missed-list__time">${reception.time.join(', ')}</p>
        <button class="item-button missed-list__button" data-id="${reception.id}">Удалить из пропущенных</button>
    </li>
    `
}

function createStockReceptionComponent(reception: Reception): string {
    return `
    <li class="stock-list__item">
        <h4 class="item-title">${reception.medicationName}</h4>
        <p class="stock-list__stock">Осталось ${reception.stock} таблеток!!!</p>
    </li>
    `
}



