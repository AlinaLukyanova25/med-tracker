import { querySelectorEl } from "./types.js";
export const baseFunctions = {
    receptionList: querySelectorEl('.reception-list'),
    renderReceptionList(arr) {
        const now = new Date();
        this.receptionList.innerHTML = '';
        for (let reception of arr) {
            if (reception.taken)
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
    }
};
