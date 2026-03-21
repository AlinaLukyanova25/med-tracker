import { querySelectorEl } from "./types.js";
export const baseFunctions = {
    receptionList: querySelectorEl('.reception-list'),
    missedList: querySelectorEl('.missed-list'),
    stockList: querySelectorEl('.stock-list'),
    renderReceptionList(arr) {
        const now = new Date();
        this.receptionList.innerHTML = '';
        this.missedList.innerHTML = '';
        for (let reception of arr) {
            if (reception.taken)
                continue;
            if (this.isYesterday(reception.dateEnd, now))
                continue;
            const result = this.getTimeReception(reception.time);
            let today;
            if (Array.isArray(result)) {
                today = result.find(t => {
                    if ((t.getTime() - now.getTime()) > 0)
                        return t;
                });
            }
            else {
                today = result;
            }
            if (!today)
                return;
            const diff = today.getTime() - now.getTime();
            if (diff > 0) {
                const li = this.createReceptionComponent(reception);
                this.receptionList.insertAdjacentHTML('beforeend', li);
            }
            else {
                const li = this.createMissedReceptionComponent(reception);
                this.missedList.insertAdjacentHTML('beforeend', li);
            }
        }
    },
    renderStockList(arr) {
        this.stockList.innerHTML = '';
        if (arr.length === 0)
            return;
        for (const reception of arr) {
            if (reception.stock <= 5) {
                const li = this.createStockReceptionComponent(reception);
                this.stockList.insertAdjacentHTML('beforeend', li);
            }
        }
    },
    getTimeReception(time) {
        const date = new Date();
        if (time.length === 1) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(time[0].slice(0, 2)), Number(time[0].slice(3)));
        }
        else {
            const newTime = time.map(t => {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(t.slice(0, 2)), Number(t.slice(3)));
            });
            return newTime;
        }
    },
    createReceptionComponent(reception) {
        return `
        <li class="reception-list__item">
            <h4 class="item-title">${reception.medicationName}</h4>
            <p class="reception-list__dosage">${reception.dosage} мг.</p>
            <p class="reception-list__time">${reception.time.join(', ')}</p>
            <button class="item-button reception-list__button" data-id="${reception.id}">Принято</button>
            <span class="reception-list__stock">Осталось таблеток: ${reception.stock}</span>
        </li>
        `;
    },
    createMissedReceptionComponent(reception) {
        return `
        <li class="missed-list__item">
            <h4 class="item-title">${reception.medicationName}</h4>
            <p class="missed-list__dosage">${reception.dosage} мг.</p>
            <p class="missed-list__time">${reception.time}</p>
            <button class="item-button missed-list__button" data-id="${reception.id}">Удалить из пропущенных</button>
        </li>
        `;
    },
    createStockReceptionComponent(reception) {
        return `
        <li class="stock-list__item">
            <h4 class="item-title">${reception.medicationName}</h4>
            <p class="stock-list__stock">Осталось ${reception.stock} таблеток!!!</p>
        </li>
        `;
    },
    shouldUpdateTaken(reception) {
        const lastUpdate = new Date(reception.lastTakenUpdate);
        const today = new Date();
        return (lastUpdate.getFullYear() !== today.getFullYear() ||
            lastUpdate.getMonth() !== today.getMonth() ||
            lastUpdate.getDate() !== today.getDate());
    },
    isYesterday(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        console.log(d1, d2);
        return d2 > d1;
    }
};
