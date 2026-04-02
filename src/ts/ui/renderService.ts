import { ButtonOpenCardClass, Disease, DivHiddenClass, Medication } from "../types/types.js"
import { sortByOrderHours, sortStock } from "../core/sortUtils.js"
import {
    createDivContainer,
    createOpenCardsComponent,
    createDiseaseComponent,
    createReceptionMainComponent,
    createMissedReceptionComponent,
    createStockReceptionComponent,
    createArchiveCardComponent
} from "./uiComponents.js"

export function renderActiveList(arr: Disease[], activeList: HTMLUListElement) {
        activeList.innerHTML = ''

        if (arr.length === 0) {
            activeList.innerHTML = '<p class="item-title descr-not">Пока нет активных приёмов</p>'
            return
        }
    
        for (let dis of arr) {
            if (dis.archive) continue
            const li = createDiseaseComponent(dis)
            activeList.insertAdjacentHTML('beforeend', li)
        }
}

function renderPaginatedList<T, U extends ButtonOpenCardClass>(
    container: HTMLElement,
    items: T[],
    renderItem: (item: T) => string,
    emptyMessage: string,
    classButton: U,
    classDiv: DivHiddenClass<U>,
    limit: number = 3
) {
    container.innerHTML = ''

    if (items.length === 0) {
        container.innerHTML = emptyMessage
        return
    }

    const visibleItems = items.slice(0, limit)
    const hiddenItems = items.slice(limit)

    visibleItems.forEach(item => {
        container.insertAdjacentHTML('beforeend', renderItem(item))
    });

    if (hiddenItems.length > 0) {
        const button = createOpenCardsComponent(classButton)
        button.textContent = `Показать остальные (${hiddenItems.length}) 🔽`
        const hiddenDiv = createDivContainer(classDiv, 'none')
        hiddenItems.forEach(item => {
            hiddenDiv.insertAdjacentHTML('beforeend', renderItem(item))
        });
        container.append(button)
        container.append(hiddenDiv)
    }
}

export function renderReceptionList(arr: Disease[], receptionList: HTMLUListElement, missedList: HTMLUListElement, medications: Medication[]): void {
    const now: Date = new Date()
    const sorted = sortByOrderHours(arr, medications)

    const todayItems = sorted.filter(med => (med.time.getTime() + 900000) - now.getTime() > 0)
    const missedItems = sorted.filter(med => (med.time.getTime() + 900000) - now.getTime() <= 0)

    renderPaginatedList(
        receptionList,
        todayItems,
        (med) => createReceptionMainComponent(med.medication, med.time),
        'На сегодня приёмов нет',
        'reception-list__open-card',
        'reception-list__card-hidden'
    )

    renderPaginatedList(
        missedList,
        missedItems,
        (med) => createMissedReceptionComponent(med.medication, med.time),
        'На сегодня нет пропущенных приёмов',
        'missed-list__open-card',
        'missed-list__card-hidden'
    )
}

export function renderStockList(arr: Disease[], stockList: HTMLUListElement, medications: Medication[]): void {
    const sorted = sortStock(arr, medications)

    renderPaginatedList(
        stockList,
        sorted,
        (med) => createStockReceptionComponent(med),
        'Пока ничего нет',
        'stock-list__open-card',
        'stock-list__card-hidden'
    )
}

export function renderArchiveList(arr: Disease[], archiveList: HTMLUListElement) {
    archiveList.innerHTML = ''

        if (arr.length === 0 || arr.filter(d => d.archive).length === 0) {
            archiveList.innerHTML = '<p class="item-title descr-not">Пока нет архивных приёмов</p>'
            return
        }

        for (let disease of arr) {
            if (!disease.archive) continue
            const li = createArchiveCardComponent(disease)
            archiveList.insertAdjacentHTML('beforeend', li)
        }
}





